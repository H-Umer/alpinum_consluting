export const generatePassword = () => {
  const alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const specialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";
  const digits = "0123456789";

  const getRandom = (charset, length) =>
    Array.from(
      { length },
      () => charset[Math.floor(Math.random() * charset.length)]
    ).join("");

  const letters = getRandom(alphabets, 6);
  const special = getRandom(specialChars, 1);
  const digit = getRandom(digits, 2);

  const combined = (letters + special + digit).split("");
  const shuffled = combined.sort(() => 0.5 - Math.random()).join("");

  return shuffled;
};
