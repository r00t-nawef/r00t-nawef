import { motion } from 'framer-motion';

const Clients = () => {
  const clients = [
    { name: 'Flynas', logo: '✈️' },
    { name: 'Saudi Airlines', logo: '🛫' },
    { name: 'GEA', logo: '🏢' },
    { name: 'STC', logo: '📡' },
    { name: 'Mobily', logo: '📱' },
    { name: 'Ministry of Education', logo: '🎓' },
    { name: 'SABIC', logo: '⚗️' },
    { name: 'NEOM', logo: '🌆' },
    { name: 'SPL', logo: '🏭' },
    { name: 'CST', logo: '💼' },
  ];

  return (
    <section id="clients" className="py-20 bg-dark-green/30 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(45deg, #006C3B 25%, transparent 25%, transparent 75%, #006C3B 75%, #006C3B), linear-gradient(45deg, #006C3B 25%, transparent 25%, transparent 75%, #006C3B 75%, #006C3B)`,
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0, 30px 30px',
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
              Trusted By Industry Leaders
            </span>
          </h2>
          <p className="text-xl text-anti-flash-white/70 max-w-2xl mx-auto">
            We protect critical infrastructure for leading organizations across the Middle East
          </p>
        </motion.div>

        {/* Clients Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {clients.map((client, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1, y: -10 }}
              className="bg-rich-black/50 backdrop-blur-md rounded-xl p-8 border border-emerald-green/20 hover:border-mountain-meadow/50 transition-all duration-300 flex flex-col items-center justify-center"
            >
              <div className="text-5xl mb-3">{client.logo}</div>
              <div className="text-anti-flash-white font-semibold text-center">
                {client.name}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              quote: "Outstanding security assessment that helped us identify critical vulnerabilities before they could be exploited.",
              author: "Security Director",
              company: "Major Airline",
            },
            {
              quote: "Their red team operations provided invaluable insights into our security posture and detection capabilities.",
              author: "CISO",
              company: "Telecommunications Leader",
            },
            {
              quote: "Professional, thorough, and incredibly knowledgeable. The best cybersecurity partner we've worked with.",
              author: "IT Manager",
              company: "Government Entity",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-dark-green/50 backdrop-blur-md rounded-xl p-6 border border-emerald-green/20"
            >
              <div className="text-mountain-meadow text-4xl mb-4">"</div>
              <p className="text-anti-flash-white/80 mb-4 italic">
                {testimonial.quote}
              </p>
              <div className="border-t border-emerald-green/20 pt-4">
                <div className="text-anti-flash-white font-semibold">
                  {testimonial.author}
                </div>
                <div className="text-anti-flash-white/60 text-sm">
                  {testimonial.company}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Clients;
