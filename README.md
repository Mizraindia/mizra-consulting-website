# Mizra Consulting - Professional IT Services Website

A high-performance, SEO-optimized website built with Next.js 15, featuring a modern design with orange branding, comprehensive IT services showcase, and a 3-step contact form with Google Sheets integration.

## 🚀 Features

- **SEO-First Approach**: Comprehensive meta tags, structured data (JSON-LD), and semantic HTML
- **High Performance**: Optimized images, code splitting, and minimal bundle size (~102KB initial load)
- **Responsive Design**: Mobile-first design that works perfectly on all devices
- **3-Step Contact Form**: Progressive form with instant Google Sheets integration
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

# Copy environment variables
cp .env.local.example .env.local

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```env
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Google Site Verification
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code

# Google Sheets Webhook (for contact form)
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_ID/exec
```

### Google Sheets Integration

See `SETUP_GUIDE.md` for detailed instructions on setting up the Google Sheets webhook for the contact form.

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
- 3-step progressive form
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
