import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private'; 
const SMTP_SERVER = env.SMTP_SERVER;
const SMTP_PORT = env.SMTP_PORT;
const SMTP_USERNAME = env.SMTP_USERNAME;
const SMTP_PASSWORD = env.SMTP_PASSWORD;
const ADMIN_NAME = env.ADMIN_NAME;
const ADMIN_EMAIL = env.ADMIN_EMAIL;

export default async function sendMail(to, subject, message) {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: SMTP_SERVER,
      port: SMTP_PORT,
      secure: parseInt(SMTP_PORT) === 465 ? true : false, // SSL is reserved for SMPT_PORT 465
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD
      }
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"${ADMIN_NAME}" <${ADMIN_EMAIL}>`,
      to,
      subject,
      // text: 'Plain text version'
      html: message
    });
    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  } catch (err) {
    console.error(err);
  }
}
