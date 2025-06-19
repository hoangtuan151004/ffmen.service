import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

const frontendBaseUrl = 'https://coffee-craft.vercel.app';
const defaultStoreName = 'Coffee Craft';

interface WelcomeEmailProps {
  fullName?: string;
  storeName?: string;
  storeUrl?: string;
}

const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  fullName,
  storeName = defaultStoreName,
  storeUrl = frontendBaseUrl,
}) => {
  const previewText = `Chào mừng bạn đến với ${storeName}!`;

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

          <Heading style={heading}>Chào mừng bạn đến với {storeName}!</Heading>

          <Section style={contentSection}>
            <Text style={paragraph}>Xin chào {fullName || 'bạn'},</Text>
            <Text style={paragraph}>
              Cảm ơn bạn đã đăng ký tài khoản tại {storeName}. Chúng tôi rất vui khi có bạn đồng hành!
            </Text>
            <Text style={paragraph}>
              Hãy khám phá các sản phẩm cà phê tuyệt vời và các ưu đãi đặc biệt của chúng tôi.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={storeUrl}>
                Bắt đầu mua sắm
              </Button>
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi tại{' '}
              <Link href="mailto:support@coffeecraft.com" style={link}>
                support@coffeecraft.com
              </Link>
              .
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} {storeName}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

const main: React.CSSProperties = {
  backgroundColor: '#ffffff',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
};

const container: React.CSSProperties = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const headerSection: React.CSSProperties = {
  padding: '20px',
  borderBottom: '1px solid #e6e6e6',
};

const logoText: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center',
  margin: '0',
};

const logoCoffee: React.CSSProperties = {
  color: '#1a1a1a',
};

const logoCraft: React.CSSProperties = {
  color: '#f5a623',
};

const heading: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center',
  color: '#1a1a1a',
  margin: '30px 0',
};

const contentSection: React.CSSProperties = {
  padding: '0px 40px',
};

const paragraph: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#333333',
  margin: '0 0 20px 0',
};

const buttonContainer: React.CSSProperties = {
  textAlign: 'center',
  margin: '30px 0',
};

const button: React.CSSProperties = {
  backgroundColor: '#f5a623',
  color: '#ffffff',
  padding: '12px 24px',
  fontSize: '14px',
  fontWeight: 'bold',
  borderRadius: '6px',
  textDecoration: 'none',
};

const footer: React.CSSProperties = {
  padding: '20px 30px',
  marginTop: '10px',
  borderTop: '1px solid #e6e6e6',
};

const footerText: React.CSSProperties = {
  fontSize: '12px',
  color: '#888888',
  lineHeight: '18px',
  textAlign: 'center',
};

const link: React.CSSProperties = {
  color: '#007bff',
  textDecoration: 'none',
};
