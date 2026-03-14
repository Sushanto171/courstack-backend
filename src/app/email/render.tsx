import { render } from "@react-email/components";
import AdminCreatedEmail, { AdminCreatedEmailProps } from "./templates/admin-created-email";
import OTPEmail from './templates/otp-email';
import WelcomeEmail, { WelcomeEmailProps } from "./templates/welcome-email";


export const renderOtpEmail = async (otp: string) => {
  return await render(<OTPEmail otp={otp} />)
}

export const renderWelcomeEmail = async (payload: WelcomeEmailProps) => {
  return await render(<WelcomeEmail {...payload} />)
}
export const renderAdminCreatedEmail = async (payload: AdminCreatedEmailProps) => {
  return await render(<AdminCreatedEmail {...payload} />)
}