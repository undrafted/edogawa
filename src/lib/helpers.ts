export const truncateString = (s: string, max: number = 35) => {
  if (s.length > max) {
    return s.substring(0, max) + '...';
  }

  return s;
};
