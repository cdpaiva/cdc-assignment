import jwt from "jsonwebtoken";

const withAuthMiddleware = (handler) => (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = payload.userId;
    }
  } catch (err) {
    return handler(req, res);
  }
  return handler(req, res);
};

export default withAuthMiddleware;
