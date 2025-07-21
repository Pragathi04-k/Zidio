import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, Code, Smartphone, Zap, Lock, Users } from 'lucide-react';

const features = [
  {
    icon: <PenTool className="w-8 h-8 text-indigo-400" />,
    title: 'Beautiful Design',
    description: 'Elegant and intuitive interface that makes writing and reading a pleasure.'
  },
  {
    icon: <Code className="w-8 h-8 text-rose-400" />,
    title: 'Powerful Editor',
    description: 'Rich text editor with markdown support and real-time preview.'
  },
  {
    icon: <Smartphone className="w-8 h-8 text-amber-400" />,
    title: 'Fully Responsive',
    description: 'Works perfectly on all devices, from mobile to desktop.'
  },
  {
    icon: <Zap className="w-8 h-8 text-cyan-400" />,
    title: 'Blazing Fast',
    description: 'Optimized for speed with instant loading and smooth performance.'
  },
  {
    icon: <Lock className="w-8 h-8 text-emerald-400" />,
    title: 'Secure & Private',
    description: 'Your data is encrypted and protected with enterprise-grade security.'
  },
  {
    icon: <Users className="w-8 h-8 text-purple-400" />,
    title: 'Community',
    description: 'Connect with like-minded writers and grow your audience.'
  }
];

const Feature = () => {
  return (
    <section className="bg-black text-white py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Everything you need to <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-rose-400">succeed</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Powerful features designed to help you create, share, and grow your audience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/50 p-8 rounded-2xl backdrop-blur-sm border border-gray-800 hover:border-indigo-500/30 transition-all duration-300"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 to-rose-500/10 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;