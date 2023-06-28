import User from "@/models/User";
import sendgrid from "@sendgrid/mail";
import jwt from "jsonwebtoken";

import dbConnect from "@/lib/dbConnect";
import mailTemplate from "@/lib/mailTemplate";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(req, res) {
  await dbConnect();

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

  console.log(userId);
  if (req.method === "POST") {
    const { product } = req.body;
    try {
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return res
          .status(403)
          .json({ success: false, msg: "Invalid credentials" });
      }
      //   console.log({
      //     to: user.email,
      //     from: "carlos.paiva@al.infnet.edu.br",
      //     subject: "PANTRY MANAGER - You have run out of products",
      //     html: `<div>You are out of ${product}</div>`,
      //   });
      await sendgrid.send({
        to: "cdpaivaa@gmail.com",
        from: "carlos.paiva@al.infnet.edu.br",
        subject: "PANTRY MANAGER - You have run out of products",
        html: mailTemplate(user.username, product),
      });
    } catch (error) {
      console.log(error);
      return res.status(error.statusCode || 500).json({ error: error.message });
    }

    return res.status(200).json({ error: "" });
  }
  return res.status(400).json({ success: false });
}

export default sendEmail;
