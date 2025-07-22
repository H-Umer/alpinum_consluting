import jwt from "jsonwebtoken";

export const verifyAuthToken = (tokenRef) => {
  try {
    const token = tokenRef.split(" ")[1];
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid or malformed token");
  }
};
