import jwt from "jsonwebtoken";

const JWT_SECRET = "supersecret"; // later move to .env

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "24h",
  });
};


export const verifyToken = (token:string) => {
  return jwt.verify(token, JWT_SECRET) as {userId: string};
};