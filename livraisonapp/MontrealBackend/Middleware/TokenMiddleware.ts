import jwt from "jsonwebtoken";
// const jwt = require('jsonwebtoken');

export const authenticateToken = (req : any, res: any, next: any) => {
  const authHeader = req.headers['authorization']; 
  const token = authHeader && authHeader.split(' ')[1]; 
  

  if (!token) {
    return res.status(401).json({ error: "Access denied, token missing!" });
  }

  const jwtSecret = process.env.JWT_SECRET || "h4WDT6xZ9xQlXwe2eHvCXNnWn/KNFw+YREdd+6aQl1U=";

  jwt.verify(token, jwtSecret, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    req.user = user; 
    next();
  });
};