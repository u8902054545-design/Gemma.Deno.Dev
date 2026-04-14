import { Variants } from 'motion/react';

export const mdEasing = {
  standard: [0.2, 0.0, 0, 1.0],
  emphasized: [0.2, 0.0, 0, 1.0],
  decelerate: [0.0, 0.0, 0, 1.0],
  accelerate: [0.3, 0.0, 1.0, 1.0],
};

export const mdDuration = {
  short4: 0.2,
  medium1: 0.25,
  medium4: 0.4,
  long2: 0.5,
};

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: mdDuration.medium4,
      ease: mdEasing.emphasized,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: 'blur(4px)',
    transition: {
      duration: mdDuration.short4,
      ease: mdEasing.accelerate,
    },
  },
};
