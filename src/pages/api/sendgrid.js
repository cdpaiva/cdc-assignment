import User from "@/models/User";
import sendgrid from "@sendgrid/mail";
import dbConnect from "@/lib/dbConnect";
import { htmlMailTemplate, textMailTemplate } from "@/lib/mailTemplate";
import withAuthMiddleware from "@/lib/authMiddleware";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(req, res) {
  await dbConnect();

  const userId = req.userId;

  if (req.method === "POST") {
    const { product } = req.body;

    try {
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(403);
      }

      await sendgrid.send({
        to: user.email,
        from: "carlos.paiva@al.infnet.edu.br",
        subject: "PANTRY MANAGER - You have run out of products",
        html: htmlMailTemplate(user.username, product),
        text: textMailTemplate(user.username, product),
      });
      res.status(200).end();
      return;
    } catch (error) {
      return res.status(500);
    }
  }
  // returned if we received another HTTP verb
  return res.status(400);
}

export default withAuthMiddleware(sendEmail);
