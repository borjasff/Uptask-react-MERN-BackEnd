import nodemailer from "nodemailer";

export const emailRegister = async (data) => {

  const { email, name, token} = data;

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "070da425fe3bef",
      pass: "792333bd251baf"
    }
  });
  //email information
  const info = await transport.sendMail({
    from: '"Uptask -Proyect Manager" <cuentas@uptask.com>',
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
  
    //TODO: move to enviroment variable
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "070da425fe3bef",
        pass: "792333bd251baf"
      }
    });
    //email information
    const info = await transport.sendMail({
      from: '"Uptask -Proyect Manager" <cuentas@uptask.com>',
      to: email,
      subject: "Uptask -reset  your password",
      html: ` <p>Hi: ${name}, Reset  your password</p>
      <p>Your account is ready, just need to reset your password in the next link:</p>
      <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Reset  your password</a>
      <p>If you haven't reset your password, you just ignore this message</p>
      `
    })
  }
