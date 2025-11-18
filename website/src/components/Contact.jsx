import { motion } from 'framer-motion';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-20 bg-rich-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-mountain-meadow rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: Math.random(),
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                opacity: [null, Math.random()],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-green to-mountain-meadow bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>
          <p className="text-xl text-anti-flash-white/70 max-w-2xl mx-auto">
            Ready to secure your digital infrastructure? Let's discuss your security needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-dark-green/50 backdrop-blur-md rounded-2xl p-8 border border-emerald-green/20">
              <h3 className="text-2xl font-bold text-anti-flash-white mb-6">
                Send us a message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-anti-flash-white mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-rich-black/50 border border-emerald-green/30 rounded-lg px-4 py-3 text-anti-flash-white focus:outline-none focus:border-mountain-meadow transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-anti-flash-white mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-rich-black/50 border border-emerald-green/30 rounded-lg px-4 py-3 text-anti-flash-white focus:outline-none focus:border-mountain-meadow transition-colors"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-anti-flash-white mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-rich-black/50 border border-emerald-green/30 rounded-lg px-4 py-3 text-anti-flash-white focus:outline-none focus:border-mountain-meadow transition-colors"
                    placeholder="Your Company"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-anti-flash-white mb-2">
                    Service Interested In
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full bg-rich-black/50 border border-emerald-green/30 rounded-lg px-4 py-3 text-anti-flash-white focus:outline-none focus:border-mountain-meadow transition-colors"
                  >
                    <option value="">Select a service</option>
                    <option value="code-review">Code Review</option>
                    <option value="penetration-test">Penetration Testing</option>
                    <option value="web-pentest">Web Application Pentest</option>
                    <option value="mobile-pentest">Mobile Application Pentest</option>
                    <option value="cloud-pentest">Cloud Pentest</option>
                    <option value="digital-forensics">Digital Forensics</option>
                    <option value="red-team">Red Team</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-anti-flash-white mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full bg-rich-black/50 border border-emerald-green/30 rounded-lg px-4 py-3 text-anti-flash-white focus:outline-none focus:border-mountain-meadow transition-colors resize-none"
                    placeholder="Tell us about your security needs..."
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-emerald-green to-mountain-meadow text-white px-8 py-4 rounded-full font-semibold text-lg"
                >
                  Send Message
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Calendar & Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Calendly Widget */}
            <div className="bg-dark-green/50 backdrop-blur-md rounded-2xl p-8 border border-emerald-green/20">
              <h3 className="text-2xl font-bold text-anti-flash-white mb-6">
                Schedule a Meeting
              </h3>
              <p className="text-anti-flash-white/70 mb-6">
                Book a consultation with our security experts to discuss your specific needs.
              </p>
              <motion.a
                href="https://calendly.com/your-calendly-link"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full bg-gradient-to-r from-emerald-green to-mountain-meadow text-white px-8 py-4 rounded-full font-semibold text-lg text-center"
              >
                Book Consultation
              </motion.a>
            </div>

            {/* Contact Information */}
            <div className="bg-dark-green/50 backdrop-blur-md rounded-2xl p-8 border border-emerald-green/20 space-y-6">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">📧</div>
                <div>
                  <div className="text-anti-flash-white font-semibold mb-1">Email</div>
                  <a href="mailto:info@r00t.sa" className="text-mountain-meadow hover:underline">
                    info@r00t.sa
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="text-3xl">📱</div>
                <div>
                  <div className="text-anti-flash-white font-semibold mb-1">Phone</div>
                  <a href="tel:+966123456789" className="text-mountain-meadow hover:underline">
                    +966 12 345 6789
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="text-3xl">📍</div>
                <div>
                  <div className="text-anti-flash-white font-semibold mb-1">Location</div>
                  <p className="text-anti-flash-white/70">
                    Riyadh, Saudi Arabia
                  </p>
                </div>
              </div>

              <div className="border-t border-emerald-green/20 pt-6 mt-6">
                <div className="flex space-x-4">
                  {[
                    { icon: '𝕏', href: '#' },
                    { icon: '💼', href: '#' },
                    { icon: '📘', href: '#' },
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.2, y: -5 }}
                      className="w-12 h-12 bg-rich-black/50 rounded-full flex items-center justify-center text-2xl border border-emerald-green/20 hover:border-mountain-meadow/50 transition-colors"
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
