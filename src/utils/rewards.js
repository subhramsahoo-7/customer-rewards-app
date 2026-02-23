export const calculatePoints = (amount) => {
  const num = Number(amount);

  if (isNaN(num) || num <= 0) return 0;

  if (num > 100) {
    return (num - 100) * 2 + 50;
  } else if (num > 50) {
    return num - 50;
  }
  return 0;
};
