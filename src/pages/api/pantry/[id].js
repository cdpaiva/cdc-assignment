import Item from "@/models/Item";
import dbConnect from "../../../lib/dbConnect";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();
  console.log(req.query);
  const {
    query: { id },
    method,
  } = req;

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

  await dbConnect();

  switch (method) {
    case "PUT" /* Edit a model by its ID */:
      try {
        const item = await Item.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!item) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: item });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    // case "DELETE" /* Delete a model by its ID */:
    //   try {
    //     const deletedPet = await Pet.deleteOne({ _id: id });
    //     if (!deletedPet) {
    //       return res.status(400).json({ success: false });
    //     }
    //     res.status(200).json({ success: true, data: {} });
    //   } catch (error) {
    //     res.status(400).json({ success: false });
    //   }
    //   break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
