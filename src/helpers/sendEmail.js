import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;

const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  const email = {
    from: SMTP_FROM,
    to,
    subject,
    html,
  };

  await transport.sendMail(email);
  console.log(`✅ Email sent to ${to} with subject "${subject}"`);
};

export default sendEmail;


// 123456789
