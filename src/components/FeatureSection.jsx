import React from 'react';
import { Search, Clock, BarChart2 } from "lucide-react";
import { FeatureItem } from './FeatureItem';
import { motion } from 'framer-motion';

export const FeatureSection = () => {
  const features = [
    {
      icon: Search,
      description: "Dynamic dashboards that instantly visualize your team's momentum and project status."
    },
    {
      icon: Clock,
      description: "AI-powered resource balancing that prevents bottlenecks before they happen."
    },
    {
      icon: BarChart2,
      description: "Automated reporting that transforms team metrics into professional insights instantly."
    }
  ];

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {features.map((feature, index) => (
        <FeatureItem 
          key={index}
          icon={feature.icon}
          description={feature.description}
        />
      ))}
    </motion.div>
  );
};