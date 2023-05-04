import nodemailer from "nodemailer";
import logger from "./logger";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shendetintv@gmail.com",
    pass: process.env.GMAIL_APP_PASS,
  },
});

const sendMail = (sender: string[], text: string) => {
  sender.forEach((sender) => {
    const mailOptions = {
      from: "shendetintv@gmail.com",
      to: sender,
      subject: "Alert! From AirBox",
      text,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        if (error instanceof Error) {
          logger.error(error);
        }
      } else {
        logger.info("Email sent: " + info.response);
        // do something useful
      }
    });
  });
};

export default sendMail;
