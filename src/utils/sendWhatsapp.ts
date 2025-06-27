import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromWhatsappNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export async function sendWhatsapp(to: string, otp: string) {
  return await client.messages.create({
    body: `Mã OTP của bạn là: ${otp}`,
    from: fromWhatsappNumber,
    to: `whatsapp:${to}`, 
  });
};

