import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  console.log({ confirmLink });

  const response = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `
      <h1>Confirm your email</h1>
      <p>Click the link below to confirm your email</p>
      <a href="${confirmLink}">Confirm email</a>
    `,
  });

  console.log({ response });

  console.log("Email sent!");
};