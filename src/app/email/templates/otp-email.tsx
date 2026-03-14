import {
  Body,
  Container,
  Heading,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface OTPEmailProps {
  otp: string;
}

export default function OTPEmail({ otp }: OTPEmailProps) {
  return (
    <Html>
      <Tailwind>
        <Body className="bg-slate-100 font-sans py-10">
          <Container className="bg-white rounded-xl shadow-lg p-8 max-w-[520px] mx-auto">

            <Section className="text-center">
              <Heading className="text-2xl font-bold text-slate-800">
                Verify Your Identity
              </Heading>

              <Text className="text-sm text-slate-500 leading-relaxed mt-3">
                Use the verification code below to complete your authentication.
                This code will expire in <strong>5 minutes</strong>.
              </Text>
            </Section>

            <Section className="text-center my-6">
              <Text
                className="inline-block text-3xl font-bold text-slate-900 tracking-[10px] bg-slate-100 px-6 py-3 rounded-lg border border-dashed border-slate-300"
              >
                {otp}
              </Text>
            </Section>

            <Section className="text-center">
              <Text className="text-sm text-slate-500">
                If you didn’t request this, you can safely ignore this email.
              </Text>
            </Section>

            <Section className="text-center mt-8">
              <Text className="text-xs text-slate-400">
                © {new Date().getFullYear()} Courstack. All rights reserved.
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}