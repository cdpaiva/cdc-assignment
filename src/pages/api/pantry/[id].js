import withAuthMiddleware from "@/lib/authMiddleware";
import dbConnect from "@/lib/dbConnect";
import Item from "@/models/Item";

async function handler(req, res) {
  await dbConnect();

  const {
    query: { id },
    method,
  } = req;

  if (!req.userId) {
    res.status(403).json({ success: false, msg: "Authentication Invalid" });
    return;
  }

  switch (method) {
    case "PUT":
      try {
        const item = await Item.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!item) {
          return res.status(400).json({ success: false });
        }
        return res.status(200).json({ success: true, data: item });
      } catch (error) {
        return res.status(400).json({ success: false });
      }

    case "DELETE":
      try {
        await Item.findOneAndDelete({ _id: id });
        return res.status(200).json({ success: true, data: {} });
      } catch (error) {
        return res.status(400).json({ success: false });
      }
    default:
      res.status(400).json({ success: false });
      break;
  }
}

export default withAuthMiddleware(handler);
