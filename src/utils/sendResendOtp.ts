import { Resend } from 'resend';
import * as React from 'react';
import { render } from '@react-email/render';
import OtpEmail from '../emails/OtpEmail.tsx';
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function sendResendOtp(email: string, otp: string): Promise<void> {
  const emailHtml = await render(React.createElement(OtpEmail, { email, otpCode: otp }));

  await resend.emails.send({
    from: 'Your App <noreply@sixcom.io.vn>',
    to: [email],
    subject: 'Mã xác nhận OTP',
    html: emailHtml,
  });
}