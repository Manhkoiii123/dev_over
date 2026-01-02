enum AUTH {
  REGISTER = 'auth.register',
  LOGIN = 'auth.login',
  LOGOUT = 'auth.logout',
  REFRESH_TOKEN = 'auth.refresh_token',
  ACTIVE_USER = 'auth.active_user',
  GET_AUTHORIZATION_URL = 'auth.get_authorization_url',
  GOOGLE_CALLBACK = 'auth.google_callback',
}
enum MAIL {
  SEND = 'mail.send',
  SEND_OTP = 'mail.send_otp',
  VALIDATE_OTP = 'mail.validate_otp',
  RESEND_OTP = 'mail.resend_otp',
  SEND_LINK_FORGOT_PASSWORD = 'mail.send_link_forgot_password',
}
export const TCP_REQUEST_MESSAGE = {
  AUTH,
  MAIL,
};
