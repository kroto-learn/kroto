import { motion } from "framer-motion";
import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const ScrollAnimatedSection: React.FC<Props> = ({ children, className }) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: "0.5" }}
      className={className}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimatedSection;
