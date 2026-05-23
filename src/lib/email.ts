import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "ManoDweep <noreply@manodweep.com>";

export async function sendOtpEmail(email: string, otp: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Your ManoDweep password reset code",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #fdf8f0; border-radius: 16px;">
        <h2 style="color: #7c5b3e; margin-bottom: 8px;">Reset your password</h2>
        <p style="color: #5a4a3a; margin-bottom: 24px;">
          Use the code below to reset your ManoDweep password. It expires in <strong>15 minutes</strong>.
        </p>
        <div style="background: #fff; border-radius: 12px; padding: 24px; text-align: center; letter-spacing: 8px; font-size: 36px; font-weight: bold; color: #4a7c59;">
          ${otp}
        </div>
        <p style="color: #8a7a6a; font-size: 13px; margin-top: 24px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
