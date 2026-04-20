import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_TOKEN // later move to .env

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not defined");
}

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "24h",
  });
};


export const verifyToken = (token:string) => {
  return jwt.verify(token, JWT_SECRET) as {userId: string};
};