import { motion } from "framer-motion";
import React from "react";

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const AnimatedSection: React.FC<Props> = ({
  children,
  delay = 0,
  className,
}) => {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: "0.1", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
