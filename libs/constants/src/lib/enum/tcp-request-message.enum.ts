enum AUTH {
  REGISTER = 'auth.register',
  LOGIN = 'auth.login',
  LOGOUT = 'auth.logout',
  REFRESH_TOKEN = 'auth.refresh_token',
  ACTIVE_USER = 'auth.active_user',
}
enum MAIL {
  SEND = 'mail.send',
  SEND_OTP = 'mail.send_otp',
  VALIDATE_OTP = 'mail.validate_otp',
  RESEND_OTP = 'mail.resend_otp',
}
export const TCP_REQUEST_MESSAGE = {
  AUTH,
  MAIL,
};
