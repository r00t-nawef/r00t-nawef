import { motion } from 'framer-motion';
import { useState } from 'react';

const Services = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const services = [
    {
      title: 'Code Review',
      description: 'Comprehensive source code analysis to identify security vulnerabilities, code quality issues, and compliance violations.',
      icon: '🔍',
      gradient: 'from-emerald-green to-mountain-meadow',
    },
    {
      title: 'Penetration Testing',
      description: 'Simulated cyber attacks to identify and exploit security weaknesses before malicious actors can.',
      icon: '🎯',
      gradient: 'from-mountain-meadow to-emerald-green',
    },
    {
      title: 'Web Application Pentest',
      description: 'Specialized testing for web applications including OWASP Top 10, API security, and business logic flaws.',
      icon: '🌐',
      gradient: 'from-emerald-green to-mountain-meadow',
    },
    {
      title: 'Mobile Application Pentest',
      description: 'Security assessment for iOS and Android applications, including reverse engineering and runtime analysis.',
      icon: '📱',
      gradient: 'from-mountain-meadow to-emerald-green',
    },
    {
      title: 'Cloud Pentest',
      description: 'Cloud infrastructure security testing for AWS, Azure, and GCP environments with misconfigurations detection.',
      icon: '☁️',
      gradient: 'from-emerald-green to-mountain-meadow',
    },
    {
      title: 'Digital Forensics',
      description: 'Investigation and analysis of digital evidence for incident response and legal proceedings.',
      icon: '🔬',
      gradient: 'from-mountain-meadow to-emerald-green',
    },
    {
      title: 'Red Team',
      description: 'Advanced adversary simulation testing your detection and response capabilities against real-world attack scenarios.',
      icon: '⚔️',
      gradient: 'from-emerald-green to-mountain-meadow',
    },
  ];

  return (
    <section id="services" className="py-20 bg-rich-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #2CC295 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}></div>
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
              Our Services
            </span>
          </h2>
          <p className="text-xl text-anti-flash-white/70 max-w-2xl mx-auto">
            Comprehensive cybersecurity solutions tailored to protect your digital infrastructure
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="relative group"
            >
              <div className="relative h-full bg-dark-green/50 backdrop-blur-md rounded-2xl p-8 border border-emerald-green/20 hover:border-mountain-meadow/50 transition-all duration-300">
                {/* Gradient Background on Hover */}
                {hoveredIndex === index && (
                  <motion.div
                    layoutId="hoverBackground"
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-10 rounded-2xl`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    exit={{ opacity: 0 }}
                  />
                )}

                <div className="relative z-10">
                  <div className="text-5xl mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-anti-flash-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-anti-flash-white/70 leading-relaxed">
                    {service.description}
                  </p>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: hoveredIndex === index ? 1 : 0, x: hoveredIndex === index ? 0 : -10 }}
                    className="mt-6"
                  >
                    <a
                      href="#contact"
                      className={`inline-flex items-center text-mountain-meadow font-semibold`}
                    >
                      Learn More
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
