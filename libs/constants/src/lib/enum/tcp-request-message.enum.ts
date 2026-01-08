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
  GET_BY_ID = 'question.get_by_id',
  CREATE = 'question.create',
  UPDATE = 'question.update',
  DELETE = 'question.delete',
  GET_LIST = 'question.get_list',
  GET_ANALYTICS = 'question.get_analytics',
  GET_ANSWERS_BY_QUESTION_ID = 'question.get_answers_by_question_id',
  VOTE_QUESTION_AND_ANSWER = 'question.vote_question_and_answer',
  HAD_SAVED_VOTED_DOWN_VOTED_QUESTION = 'question.had_saved_voted_down_voted_question',
}
enum ANSWER {
  GET_BY_ID = 'answer.get_by_id',
  CREATE = 'answer.create',
  UPDATE = 'answer.update',
  DELETE = 'answer.delete',
  GET_LIST = 'answer.get_list',
}
export const TCP_REQUEST_MESSAGE = {
  AUTH,
  MAIL,
  QUESTION,
  ANSWER,
};
