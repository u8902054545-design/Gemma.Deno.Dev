export const drawerVariants = {
  open: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  closed: {
    x: -300,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

export const mainContentVariants = {
  open: {
    x: 300,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  closed: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};
