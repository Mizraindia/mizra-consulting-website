import { Fragment, type ReactNode } from 'react';
import Link from 'next/link';
import type { Token, Tokens } from 'marked';

// Renders article Markdown (parsed at build time) as React elements in the site style.
// Covers what articles use: headings, paragraphs, lists, tables, bold, italic, links, code.

function renderInline(tokens: Token[] | undefined, fallback = ''): ReactNode {
  if (!tokens || tokens.length === 0) return fallback;
  return tokens.map((token, i) => {
    switch (token.type) {
      case 'strong':
        return <strong key={i} className="font-semibold text-mz-ink">{renderInline((token as Tokens.Strong).tokens)}</strong>;
      case 'em':
        return <em key={i}>{renderInline((token as Tokens.Em).tokens)}</em>;
      case 'codespan':
        return <code key={i} className="rounded bg-mz-soft px-1.5 py-0.5 text-[0.9em]">{(token as Tokens.Codespan).text}</code>;
      case 'link': {
        const link = token as Tokens.Link;
        const external = /^https?:\/\//.test(link.href);
        return external ? (
          <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className="font-medium text-mz-accent underline">
            {renderInline(link.tokens)}
          </a>
        ) : (
          <Link key={i} href={link.href} className="font-medium text-mz-accent underline">
            {renderInline(link.tokens)}
          </Link>
        );
      }
      case 'br':
        return <br key={i} />;
      case 'text': {
        const text = token as Tokens.Text;
        return <Fragment key={i}>{text.tokens ? renderInline(text.tokens) : text.text}</Fragment>;
      }
      case 'escape':
        return <Fragment key={i}>{(token as Tokens.Escape).text}</Fragment>;
      default:
        return <Fragment key={i}>{'text' in token ? String(token.text) : ''}</Fragment>;
    }
  });
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/** Wide screens: a normal table. Phones: one card per column (for example per CRM). */
function ResponsiveTable({ table }: { table: Tokens.Table }) {
  const columns = table.header.slice(1);
  return (
    <>
      <div className="my-8 hidden overflow-x-auto rounded-[20px] border border-mz-border bg-white sm:block">
        <table className="w-full border-collapse text-left text-[16px]">
          <thead>
            <tr className="bg-mz-soft">
              {table.header.map((cell, i) => (
                <th key={i} scope="col" className="px-4 py-3 font-display font-semibold">
                  {renderInline(cell.tokens, cell.text)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, r) => (
              <tr key={r} className="border-t border-mz-border align-top">
                {row.map((cell, c) =>
                  c === 0 ? (
                    <th key={c} scope="row" className="px-4 py-3 font-semibold text-mz-ink">
                      {renderInline(cell.tokens, cell.text)}
                    </th>
                  ) : (
                    <td key={c} className="px-4 py-3 text-mz-body">
                      {renderInline(cell.tokens, cell.text)}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="my-8 space-y-4 sm:hidden">
        {columns.map((column, c) => (
          <section key={c} className="rounded-[20px] border border-mz-border bg-white p-5">
            <h3 className="mb-3 font-display text-xl font-semibold">{renderInline(column.tokens, column.text)}</h3>
            <dl className="space-y-3 text-[16px]">
              {table.rows.map((row, r) => (
                <div key={r}>
                  <dt className="font-semibold text-mz-ink">{renderInline(row[0].tokens, row[0].text)}</dt>
                  <dd className="text-mz-body">{renderInline(row[c + 1]?.tokens, row[c + 1]?.text)}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </>
  );
}

function renderBlock(token: Token, i: number): ReactNode {
  switch (token.type) {
    case 'heading': {
      const heading = token as Tokens.Heading;
      if (heading.depth === 2) {
        return (
          <h2 key={i} id={slugify(heading.text)} className="mb-4 mt-12 font-display text-[26px] font-semibold leading-tight sm:text-[30px]">
            {renderInline(heading.tokens, heading.text)}
          </h2>
        );
      }
      return (
        <h3 key={i} className="mb-3 mt-8 font-display text-[21px] font-semibold leading-snug sm:text-[23px]">
          {renderInline(heading.tokens, heading.text)}
        </h3>
      );
    }
    case 'paragraph':
      return (
        <p key={i} className="mb-5 text-mz-body">
          {renderInline((token as Tokens.Paragraph).tokens)}
        </p>
      );
    case 'list': {
      const list = token as Tokens.List;
      const ListTag = list.ordered ? 'ol' : 'ul';
      return (
        <ListTag
          key={i}
          className={`mb-6 space-y-2 pl-6 text-mz-body marker:text-mz-accent ${list.ordered ? 'list-decimal' : 'list-disc'}`}
        >
          {list.items.map((item, j) => (
            <li key={j} className="pl-1">
              {item.tokens.map((child, k) =>
                child.type === 'text' ? (
                  <Fragment key={k}>{renderInline((child as Tokens.Text).tokens, (child as Tokens.Text).text)}</Fragment>
                ) : (
                  renderBlock(child, k)
                ),
              )}
            </li>
          ))}
        </ListTag>
      );
    }
    case 'table':
      return <ResponsiveTable key={i} table={token as Tokens.Table} />;
    case 'blockquote':
      return (
        <blockquote key={i} className="my-6 border-l-2 border-mz-amber pl-4 text-mz-body">
          {(token as Tokens.Blockquote).tokens.map(renderBlock)}
        </blockquote>
      );
    case 'hr':
      return <hr key={i} className="my-10 border-mz-border" />;
    default:
      return null;
  }
}

export default function Markdown({ tokens }: { tokens: Token[] }) {
  return <>{tokens.map(renderBlock)}</>;
}
