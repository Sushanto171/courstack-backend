import {
  Body,
  Button,
  Container,
  Heading,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export interface AdminCreatedEmailProps {
  name?: string;
  email: string;
  password: string;
  loginUrl: string;
}

export default function AdminCreatedEmail({
  name = "Admin",
  email,
  password,
  loginUrl,
}: AdminCreatedEmailProps) {
  return (
    <Html>
      <Tailwind>
        <Body className="bg-slate-100 font-sans py-10">
          <Container className="bg-white rounded-xl shadow-lg p-8 max-w-[520px] mx-auto">

            {/* Header */}
            <Section className="text-center">
              <Heading className="text-2xl font-bold text-slate-800">
                Admin Account Created
              </Heading>

              <Text className="text-sm text-slate-500 mt-3">
                Hello {name},
              </Text>

              <Text className="text-sm text-slate-500 leading-relaxed mt-2">
                A Super Administrator has created an admin account for you.
                Use the credentials below to access the platform.
              </Text>
            </Section>

            {/* Credentials */}
            <Section className="bg-slate-100 rounded-lg p-5 my-6">
              <Text className="text-sm text-slate-700">
                <strong>Email:</strong> {email}
              </Text>

              <Text className="text-sm text-slate-700 mt-2">
                <strong>Temporary Password:</strong> {password}
              </Text>
            </Section>

            {/* Security Notice */}
            <Section>
              <Text className="text-sm text-amber-600 text-center">
                For security reasons, you must change your password after your
                first login.
              </Text>
            </Section>

            {/* CTA */}
            <Section className="text-center my-6">
              <Button
                href={loginUrl}
                className="bg-slate-900 text-white px-6 py-3 rounded-lg text-sm font-semibold"
              >
                Login to Dashboard
              </Button>
            </Section>

            {/* Footer */}
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