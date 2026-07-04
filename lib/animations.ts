import type { Variants } from 'framer-motion';

export const pageVariants: Variants = {
  hidden:  { opacity: 0, y: 16, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)',
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  },
  exit:    { opacity: 0, y: -8, filter: 'blur(4px)',
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  },
};

export const cardVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.96, filter: 'blur(8px)' },
  visible: { opacity: 1, scale: 1,    filter: 'blur(0px)',
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
  },
  exit:    { opacity: 0, scale: 0.97, filter: 'blur(4px)',
    transition: { duration: 0.2 }
  },
};

export const listVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  },
};

export const listItemVariants: Variants = {
  hidden:  { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)',
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  },
};

export const fadeVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

export const slideUpVariants: Variants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  },
  exit:    { opacity: 0, y: 20,
    transition: { duration: 0.2 }
  },
};

export const successVariants: Variants = {
  hidden:  { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }
  },
};

export const numberPopVariants: Variants = {
  hidden:  { opacity: 0, y: -8, scale: 0.95 },
  visible: { opacity: 1, y: 0,  scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 25 }
  },
};

export const buttonTap = {
  whileTap:   { scale: 0.96 },
  whileHover: { scale: 1.02 },
  transition: { type: 'spring', stiffness: 400, damping: 20 },
};