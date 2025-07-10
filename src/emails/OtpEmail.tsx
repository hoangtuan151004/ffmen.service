import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

const defaultStoreName = "Coffee Craft";

interface OtpEmailProps {
  email: string;
  otpCode: string;
  storeName?: string;
}

const OtpEmail: React.FC<OtpEmailProps> = ({
  email,
  otpCode,
  storeName = defaultStoreName,
}) => {
  const previewText = `Mã OTP của bạn là ${otpCode} - ${storeName}`;
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Text style={logoText}>
              <span style={logoCoffee}>Coffee</span>
              <span style={logoCraft}>Craft</span>
            </Text>
          </Section>
          <Section style={contentSection}>
            <Heading style={heading}>Mã xác nhận OTP</Heading>
            <Text style={paragraph}>
              Xin chào người dùng có email <strong>{email}</strong>,
              <br />
              Đây là mã OTP của bạn:
            </Text>
            <Text style={otpBox}>{otpCode}</Text>
            <Text style={paragraph}>
              Mã OTP này sẽ hết hạn sau 5 phút. Nếu bạn không yêu cầu, hãy bỏ
              qua email này.
            </Text>
          </Section>
          <Section style={footer}>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} {storeName}. All rights
              reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OtpEmail;

const main: React.CSSProperties = {
  backgroundColor: "#ffffff",
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const headerSection: React.CSSProperties = {
  padding: "20px",
  borderBottom: "1px solid #e6e6e6",
};

const otpBox: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "8px",
  textAlign: "center",
  background: "#f0f0f0",
  borderRadius: "8px",
  padding: "16px",
  margin: "24px 0",
};

const logoText: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: "bold",
  textAlign: "center",
  margin: "0",
  padding: "10px 0",
};

const logoCoffee: React.CSSProperties = {
  color: "#1a1a1a",
};

const logoCraft: React.CSSProperties = {
  color: "#f5a623",
};

const contentSection: React.CSSProperties = {
  padding: "0px 40px",
};

const heading: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center",
  color: "#1a1a1a",
  margin: "30px 0",
};

const paragraph: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#333333",
  margin: "0 0 20px 0",
};

const footer: React.CSSProperties = {
  padding: "20px 30px",
  marginTop: "10px",
  borderTop: "1px solid #e6e6e6",
};

const footerText: React.CSSProperties = {
  fontSize: "12px",
  color: "#888888",
  lineHeight: "18px",
  textAlign: "center",
  marginBottom: "10px",
};

const link: React.CSSProperties = {
  color: "#007bff",
  textDecoration: "none",
};
