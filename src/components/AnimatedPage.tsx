import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
}

const animations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const AnimatedPage = ({ children, className }: AnimatedPageProps) => {
  return (
    <motion.div
      animate="animate"
      className={className}
      exit="exit"
      initial="initial"
      transition={{ duration: 0.4, ease: "easeInOut" }}
      variants={animations}
    >
      {children}
    </motion.div>
  );
};
