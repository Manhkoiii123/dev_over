enum AUTH {
  REGISTER = 'auth.register',
  LOGIN = 'auth.login',
  LOGOUT = 'auth.logout',
  REFRESH_TOKEN = 'auth.refresh_token',
}
enum MAIL {
  SEND = 'mail.send',
  SEND_OTP = 'mail.send_otp',
  VALIDATE_OTP = 'mail.validate_otp',
}
export const TCP_REQUEST_MESSAGE = {
  AUTH,
  MAIL,
};
