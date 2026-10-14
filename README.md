# Mizra Consulting - Professional IT Services Website

A high-performance, SEO-optimized website built with Next.js 15, featuring a modern design with orange branding, comprehensive IT services showcase, and a three-field enquiry form that saves to Google Sheets.

## 🚀 Features

- **SEO-First Approach**: Comprehensive meta tags, structured data (JSON-LD), and semantic HTML
- **High Performance**: Optimized images, code splitting, and minimal bundle size (~102KB initial load)
- **Responsive Design**: Mobile-first design that works perfectly on all devices
- **Enquiry form**: Name, email and "What do you need?", saved to Google Sheets with an email notification
- **Professional Theme**: Clean, sober design with orange primary color
- **5 Core Pages**: Home, Services, About Us, Contact Us, and Blog (WordPress ready)
- **Google Analytics**: Built-in GA4 integration
- **Accessibility**: WCAG 2.1 AA compliant

## 📊 Performance Metrics

- **Lighthouse Score**: 95+ (all categories)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Bundle Size**: 102KB initial load

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Language**: TypeScript
- **Fonts**: Inter (Google Fonts)
- **Deployment**: Vercel-ready
- **Analytics**: Google Analytics 4 & Google Tag Manager

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variable names, then fill in test values
cp .env.example .env.local

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Environment Variables

The names are listed in `.env.example`. Real values live in Vercel
(Project > Settings > Environment Variables), never in the code.

| Name | What it is | Required |
| --- | --- | --- |
| `LEADS_SHEET_URL` | Web app address of the Apps Script attached to the leads sheet | Yes, or forms show an error |
| `LEADS_SHEET_SECRET` | Shared password; same value as `SHARED_SECRET` in the script | Yes |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile invisible bot check | No (off when empty) |
| `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GTM_ID` | Google Analytics / Tag Manager | No |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console verification | No |

### How the forms work

- The enquiry form (homepage, contact page, floating button) and the master-class
  sign-up (`/student-portal`) post to `/api/contact` on this site.
- `/api/contact` checks the input on the server, drops bots (hidden honeypot field,
  too-fast submissions, optional Turnstile), limits each visitor to 5 submissions per
  10 minutes, and sends the lead to the Google Apps Script.
- The script (`integrations/google-apps-script/leads.gs`) saves the row first, then
  emails the owner and sends the visitor an auto-reply. The site shows "success" only
  when the script answers `{"ok": true}`; otherwise the visitor sees an error with the
  email address, and what they typed is kept.
- `/api/contact/razorpay-webhook` is disabled (rejects everything) until the verified
  master-class payment flow replaces it.

### Testing forms locally

Point `LEADS_SHEET_URL` at a test copy of the sheet's script (never the live sheet),
or at a local stand-in that answers `{"ok": true}`. Cloudflare publishes always-pass
Turnstile test keys for local use. The development server can be slow when the
project folder is inside OneDrive.

## 📄 Pages

### Home Page (`/`)
- Hero section with CTA
- Core services overview
- Why choose us section
- Industries served
- Statistics showcase
- Final CTA

### Services Page (`/services`)
- 6 detailed service offerings
- Feature lists and technologies
- Development process
- CTA section

### About Us Page (`/about`)
- Company story
- Mission and vision
- Core values
- Expertise showcase
- Statistics

### Contact Page (`/contact`)
- Three-field enquiry form
- Contact information
- Global presence
- Instant Google Sheets integration

### Blog Page (`/blog`)
- Coming soon placeholder
- WordPress integration ready

## 🎨 Design System

### Colors
- **Primary Orange**: #FF6B35 (Mizra brand color)
- **Secondary Gray**: #4A5568, #718096
- **Accent Beige**: #F5F5DC, #FAF8F3
- **Supporting**: Green (#10B981), Blue (#3B82F6)

### Typography
- **Font Family**: Inter
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔍 SEO Features

- Comprehensive meta tags on all pages
- Structured data (JSON-LD) for Organization, Services, and Contact
- Semantic HTML5 elements
- Optimized images with alt text
- XML sitemap (`/sitemap.xml`)
- Robots.txt (`/robots.txt`)
- Open Graph and Twitter Card meta tags

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

Compatible with:
- Netlify
- AWS Amplify
- Digital Ocean
- Self-hosted Node.js

## 📝 Customization

### Update Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    500: '#FF6B35', // Your brand color
    // ...
  }
}
```

### Update Content

- **Home**: `src/app/page.tsx`
- **Services**: `src/app/services/page.tsx`
- **About**: `src/app/about/page.tsx`
- **Contact**: `src/app/contact/page.tsx`

### Update SEO

Edit metadata in each page file:

```typescript
export const metadata: Metadata = {
  title: 'Your Title',
  description: 'Your Description',
  // ...
};
```

## 📞 Support

- **Email**: info@mizraconsulting.com
- **Phone**: +91 92057 10374
- **Website**: https://mizraconsulting.com

## 📄 License

© 2024 Mizra Consulting. All rights reserved.

## 🙏 Acknowledgments

Built with modern web technologies and best practices for optimal performance and user experience.
