export const truncateString = (s: string, max: number = 35) => {
  if (s.length > 35) {
    return s.substring(0, max) + '...';
  }

  return s;
};
