enum AUTH {
  REGISTER = 'auth.register',
  LOGIN = 'auth.login',
  LOGOUT = 'auth.logout',
  REFRESH_TOKEN = 'auth.refresh_token',
  ACTIVE_USER = 'auth.active_user',
  GET_AUTHORIZATION_URL = 'auth.get_authorization_url',
  RESET_PASSWORD = 'mail.reset_password',
  GOOGLE_CALLBACK = 'auth.google_callback',
  VERIFY_USER_TOKEN = 'auth.verify_user_token',
  GET_ME = 'auth.get_me',
}
enum MAIL {
  SEND = 'mail.send',
  SEND_OTP = 'mail.send_otp',
  VALIDATE_OTP = 'mail.validate_otp',
  RESEND_OTP = 'mail.resend_otp',
  SEND_LINK_FORGOT_PASSWORD = 'mail.send_link_forgot_password',
  RESEND_LINK_FORGOT_PASSWORD = 'mail.resend_link_forgot_password',
}
enum QUESTION {
  GET_BY_ID = 'question.get_',
  CREATE = 'question.create',
  UPDATE = 'question.update',
  DELETE = 'question.delete',
}
export const TCP_REQUEST_MESSAGE = {
  AUTH,
  MAIL,
  QUESTION,
};
