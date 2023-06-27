import User from "../../models/User";
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(404)
          .json({ success: false, msg: "Please provide email and password" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(403)
          .json({ success: false, msg: "Invalid credentials" });
      }
      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        return res
          .status(403)
          .json({ success: false, msg: "Invalid credentials" });
      }
      const token = user.createJWT();

      return res.status(200).json({ user: { name: user.name }, token });
    default:
      return res.status(400).json({ success: false });
  }
}
