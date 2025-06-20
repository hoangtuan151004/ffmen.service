import { Resend } from 'resend';
import * as React from 'react';
import { render } from '@react-email/render';
import WelcomeEmail from "../emails/WelcomeEmail.tsx";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function sendWelcomeEmail(email: string, fullName: string): Promise<void> {
  const emailHtml = await render(React.createElement(WelcomeEmail, { fullName }));

  await resend.emails.send({
    from: 'Your App <noreply@sixcom.io.vn>',
    to: [email],
    subject: 'Chào mừng bạn đến với',
    html: emailHtml,
  });
}