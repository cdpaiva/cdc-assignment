import withAuthMiddleware from "@/lib/authMiddleware";
import dbConnect from "@/lib/dbConnect";
import Item from "@/models/Item";

async function handler(req, res) {
  await dbConnect();

  if (!req.userId) {
    res.status(403).json({ success: false, msg: "Authentication Invalid" });
    return;
  }
  const userId = req.userId;

  switch (req.method) {
    case "GET":
      try {
        const items = await Item.find({ userId });
        return res.status(200).json({ success: true, data: items });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error: error.name });
      }
    case "POST":
      try {
        const item = await Item.create({ ...req.body, userId });
        return res.status(201).json({ success: true, data: item });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error: error.name });
      }
    default:
      return res.status(400).json({ success: false });
  }
}

export default withAuthMiddleware(handler);
