import jwt from "jsonwebtoken";

const withAuthMiddleware = (handler) => (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
  }
  return handler(req, res);
};

export default withAuthMiddleware;
