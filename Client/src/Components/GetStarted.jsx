import React from 'react';
import { motion } from 'framer-motion';

const GetStarted = () => {
  return (
    <section className="relative bg-black text-white py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-rose-500/5" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to start your journey?
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10">
            Join thousands of creators and start sharing your stories with the world.
            It's free and only takes a minute to get started.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-100 transition-colors"
            >
              Get Started for Free
            </motion.button>
        
          </div>
        
        </div>
        

      </div>
    </section>
  );
};

export default GetStarted;