# R00T Cybersecurity Website

Modern, responsive cybersecurity website built with React, Vite, Tailwind CSS, and Framer Motion.

## 🎨 Features

- **Modern Design**: Innovative UI/UX inspired by industry leaders
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Animations**: Smooth transitions and interactions using Framer Motion
- **Brand Colors**:
  - Emerald Green (#006C3B)
  - Mountain Meadow (#2CC295)
  - Dark Green (#032221)
  - Anti-Flash White (#F1F7F6)
  - Rich Black (#000F11)
- **Custom Font**: Space Grotesk from Google Fonts

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
cd website
npm install
```

### Development

```bash
npm run dev
```

The website will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
website/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx      # Navigation bar
│   │   ├── Hero.jsx        # Hero section with animations
│   │   ├── Services.jsx    # Services showcase
│   │   ├── Clients.jsx     # Client logos and testimonials
│   │   ├── Contact.jsx     # Contact form and Calendly integration
│   │   └── Footer.jsx      # Footer with links
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles and Tailwind imports
├── public/                 # Static assets
├── index.html              # HTML template
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
└── vite.config.js          # Vite configuration
```

## 🔧 Customization

### Update Calendly Link

Edit `src/components/Contact.jsx` and replace the Calendly URL:

```jsx
<a
  href="https://calendly.com/YOUR-LINK-HERE"
  target="_blank"
  rel="noopener noreferrer"
  ...
>
```

### Add Your Logo

Replace the text logo in `src/components/Navbar.jsx` with your actual logo image.

### Update Contact Information

Edit the contact details in `src/components/Contact.jsx`:
- Email
- Phone
- Location
- Social media links

## 🎯 Sections

1. **Hero**: Eye-catching hero section with animated text and stats
2. **Services**: Showcasing 7 cybersecurity services:
   - Code Review
   - Penetration Testing
   - Web Application Pentest
   - Mobile Application Pentest
   - Cloud Pentest
   - Digital Forensics
   - Red Team
3. **Clients**: Display of trusted clients with testimonials
4. **Contact**: Contact form and Calendly integration
5. **Footer**: Links and social media

## 🌐 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload the 'dist' folder to Netlify
```

### Deploy to GitHub Pages

```bash
npm run build
# Push the 'dist' folder to gh-pages branch
```

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## ⚡ Technologies Used

- **React**: UI library
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Space Grotesk**: Google Font

## 📄 License

MIT License

## 🤝 Support

For issues or questions, please contact the development team.

---

Built with ❤️ for R00T Cybersecurity
