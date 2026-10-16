// Reads Resources articles from src/content/blog/*.md at build time (server only).
//
// To publish an article: add a Markdown file to src/content/blog with this front matter:
//   ---
//   title: "..."
//   slug: the-address-after-blog
//   description: "One line, about 155 characters or fewer"
//   date: YYYY-MM-DD
//   category: "..."
//   readTime: "7 min read"
//   author: "Mizra Consulting"
//   ---
// The "# Title" line is skipped (the page shows the title). A "## Questions people ask"
// section becomes FAQ data for search engines. A final "## Still not sure?" section is
// shown as the call-to-action box that links to the enquiry form.

import fs from 'node:fs';
import path from 'node:path';
import { marked, type Token, type Tokens } from 'marked';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');
const FAQ_HEADING = 'questions people ask';
const CTA_HEADING = 'still not sure?';

export interface PostMeta {
  title: string;
  slug: string;
  description: string;
  date: string;
  category: string;
  readTime: string;
  author: string;
}

export interface Post extends PostMeta {
  /** Article body without the "# Title" line and without the closing CTA section. */
  body: Token[];
  faq: { q: string; a: string }[];
  cta: { heading: string; text: string };
}

const DEFAULT_CTA = {
  heading: 'Still not sure?',
  text: 'Tell us what is going on. We will tell you honestly what we would choose, and what it would take. We reply within 4 business hours.',
};

function parseFrontMatter(source: string): { meta: Record<string, string>; content: string } {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { meta: {}, content: source };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^(\w+):\s*(.*)$/);
    if (pair) meta[pair[1]] = pair[2].trim().replace(/^"(.*)"$/, '$1');
  }
  return { meta, content: source.slice(match[0].length) };
}

/** Plain text of Markdown inline syntax (for search-engine data). */
function plainText(markdown: string): string {
  return markdown.replace(/\*\*|__|\*|_|`/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').trim();
}

function isHeading(token: Token, depth: number): token is Tokens.Heading {
  return token.type === 'heading' && (token as Tokens.Heading).depth === depth;
}

function readPost(file: string): Post {
  const { meta, content } = parseFrontMatter(fs.readFileSync(path.join(BLOG_DIR, file), 'utf8'));
  const required = ['title', 'slug', 'description', 'date', 'category', 'readTime', 'author'];
  const missing = required.filter((key) => !meta[key]);
  if (missing.length > 0) throw new Error(`${file}: missing front matter ${missing.join(', ')}`);

  const tokens = marked.lexer(content).filter((token) => !isHeading(token, 1));

  // Questions and answers for FAQ data: each "###" heading and the paragraphs under it.
  const faq: Post['faq'] = [];
  const faqStart = tokens.findIndex((t) => isHeading(t, 2) && t.text.toLowerCase() === FAQ_HEADING);
  if (faqStart >= 0) {
    for (let i = faqStart + 1; i < tokens.length && !isHeading(tokens[i], 2); i++) {
      const token = tokens[i];
      if (isHeading(token, 3)) faq.push({ q: plainText(token.text), a: '' });
      else if (token.type === 'paragraph' && faq.length > 0) {
        const last = faq[faq.length - 1];
        last.a = [last.a, plainText((token as Tokens.Paragraph).text)].filter(Boolean).join(' ');
      }
    }
  }

  // A final "Still not sure?" section becomes the call-to-action box.
  let body = tokens;
  let cta = DEFAULT_CTA;
  const ctaStart = tokens.findIndex((t) => isHeading(t, 2) && t.text.toLowerCase() === CTA_HEADING);
  if (ctaStart >= 0) {
    const text = tokens
      .slice(ctaStart + 1)
      .filter((t): t is Tokens.Paragraph => t.type === 'paragraph')
      .map((t) => plainText(t.text))
      .join(' ');
    cta = { heading: (tokens[ctaStart] as Tokens.Heading).text, text: text || DEFAULT_CTA.text };
    body = tokens.slice(0, ctaStart);
  }

  return {
    title: meta.title,
    slug: meta.slug,
    description: meta.description,
    date: meta.date,
    category: meta.category,
    readTime: meta.readTime,
    author: meta.author,
    body,
    faq,
    cta,
  };
}

/** All posts, newest first. */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.md'))
    .map(readPost)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

/** "16 October 2026" */
export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${isoDate}T00:00:00Z`),
  );
}
