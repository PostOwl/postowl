import nodemailer from 'nodemailer';
import { dev } from '$app/environment';

import {
  SMTP_SERVER,
  SMTP_PORT,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  ADMIN_NAME,
  ADMIN_EMAIL
} from '$env/static/private';

export default async function sendMail(to, subject, message) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: dev ? false : true, // don't use SSL for emails in dev
    auth: {
      user: SMTP_USERNAME,
      pass: SMTP_PASSWORD,
    },
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"${ADMIN_NAME}" <${ADMIN_EMAIL}>`,
    to,
    subject,
    // text: 'Plain text version'
    html: message,
  });
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}
