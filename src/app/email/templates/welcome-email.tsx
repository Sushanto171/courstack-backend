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

export interface WelcomeEmailProps {
  name?: string;
  dashboardUrl?: string;
}

export default function WelcomeEmail({
  name = "there",
  dashboardUrl = "https://courstack.vercel.app/dashboard",
}: WelcomeEmailProps) {
  return (
    <Html>
      <Tailwind>
        <Body className="bg-slate-100 font-sans py-10">
          <Container className="bg-white rounded-xl shadow-lg p-8 max-w-[520px] mx-auto">

            {/* Header */}
            <Section className="text-center">
              <Heading className="text-2xl font-bold text-slate-800">
                Welcome to Courstack 🎉
              </Heading>

              <Text className="text-sm text-slate-500 mt-3">
                Hi {name},
              </Text>

              <Text className="text-sm text-slate-500 leading-relaxed mt-2">
                Your account has been successfully created. We're excited to
                have you on board. Start exploring your dashboard and discover
                all the tools designed to help you move faster.
              </Text>
            </Section>

            {/* CTA */}
            <Section className="text-center my-6">
              <Button
                href={dashboardUrl}
                className="bg-slate-900 text-white px-6 py-3 rounded-lg text-sm font-semibold"
              >
                Go to Dashboard
              </Button>
            </Section>

            {/* Info */}
            <Section className="text-center">
              <Text className="text-sm text-slate-500">
                If you have any questions or need support, feel free to reply
                to this email. Our team is always here to help.
              </Text>
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