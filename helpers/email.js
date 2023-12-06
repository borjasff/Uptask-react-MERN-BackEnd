import nodemailer from "nodemailer";

export const emailRegister = async (data) => {

  const { email, name, token} = data;

  //information in nodemailer transport
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });
  //email information
  const info = await transport.sendMail({
    from: '"Uptask -Project Manager" <cuentas@uptask.com>',
    to: email,
    subject: "Uptask -Verify your account",
    html: ` <p>Hi: ${name} Verify your account in Uptask</p>
    <p>Your account is ready, just need to verify in the next link:</p>
    <a href="${process.env.FRONTEND_URL}/confirm/${token}">Verify account</a>
    <p>If you haven't created this account, you just ignore this message</p>
    `
  })
}

export const emailForgotPassword = async (data) => {

    const { email, name, token} = data;
  
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });
    //email information
    const info = await transport.sendMail({
      from: '"Uptask -Project Manager" <cuentas@uptask.com>',
      to: email,
      subject: "Uptask -reset  your password",
      html: ` <p>Hi: ${name}, Reset  your password</p>
      <p>Your account is ready, just need to reset your password in the next link:</p>
      <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Reset  your password</a>
      <p>If you haven't reset your password, you just ignore this message</p>
      `
    })
  }
