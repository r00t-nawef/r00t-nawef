import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Services: [
      { name: 'Code Review', href: '#services' },
      { name: 'Penetration Testing', href: '#services' },
      { name: 'Web Application Pentest', href: '#services' },
      { name: 'Mobile Application Pentest', href: '#services' },
      { name: 'Cloud Pentest', href: '#services' },
      { name: 'Digital Forensics', href: '#services' },
      { name: 'Red Team', href: '#services' },
    ],
    Company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Contact', href: '#contact' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
    ],
  };

  return (
    <footer className="bg-dark-green/50 backdrop-blur-md border-t border-emerald-green/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-bold text-mountain-meadow mb-4"
            >
              R00T
            </motion.div>
            <p className="text-anti-flash-white/70 mb-6 max-w-md">
              Elite cybersecurity services protecting critical infrastructure across the Middle East.
              Your trusted partner in digital security.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: '𝕏', href: '#', label: 'Twitter' },
                { icon: '💼', href: '#', label: 'LinkedIn' },
                { icon: '📘', href: '#', label: 'Facebook' },
                { icon: '📷', href: '#', label: 'Instagram' },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -5 }}
                  className="w-10 h-10 bg-rich-black/50 rounded-full flex items-center justify-center text-xl border border-emerald-green/20 hover:border-mountain-meadow/50 transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-anti-flash-white font-bold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-anti-flash-white/70 hover:text-mountain-meadow transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-green/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-anti-flash-white/60 text-sm">
              © {currentYear} R00T Cybersecurity. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-anti-flash-white/60">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-mountain-meadow rounded-full animate-pulse"></span>
                <span>Secured & Encrypted</span>
              </div>
              <div>
                Made with <span className="text-red-500">♥</span> in Saudi Arabia
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
