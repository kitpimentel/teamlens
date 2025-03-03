import React from 'react';
import { motion } from 'framer-motion';

export const FeatureItem = ({ icon: Icon, description }) => {
  return (
    <motion.div 
      className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="bg-primary/10 p-3 rounded-full">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <p className="text-center md:text-left font-medium">
        {description}
      </p>
    </motion.div>
  );
};