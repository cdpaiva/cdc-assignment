import Item from "@/models/Item";
import jwt from "jsonwebtoken";

// import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication Invalid");
  }

  const token = authHeader.split(" ")[1];
  let userId;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    userId = payload.userId;
  } catch (err) {
    throw new UnauthenticatedError("Authentication Invalid");
  }

  switch (req.method) {
    case "GET":
      try {
        const items = await Item.find({ userId });
        res.status(200).json({ success: true, data: items });
        return;
      } catch (error) {
        res.status(400).json({ success: false, error: error });
        return;
      }
    case "POST":
      try {
        const item = await Item.create({ ...req.body, userId });
        res.status(201).json({ success: true, data: item });
        return;
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, error: error });
        return;
      }
    default:
      res.status(400).json({ success: false });
      return;
  }
}
