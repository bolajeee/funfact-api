export const DEFINITIONS = {
  armstrong: "An Armstrong number is a number that is the sum of its own digits each raised to the power of the number of digits",
  perfect: "A perfect number is a positive integer that is equal to the sum of its proper divisors excluding itself"
};

export const isArmstrong = (number) => {
  const digits = String(number).split("").map(Number);
  const power = digits.length;
  const sum = digits.reduce((acc, digit) => acc + Math.pow(digit, power), 0);
  return sum === number;
};

export const isPerfect = (number) => {
  const sum = Array.from({ length: number - 1 }, (_, i) => i + 1)
    .filter((i) => number % i === 0)
    .reduce((acc, val) => acc + val, 0);
  return sum === number;
};
