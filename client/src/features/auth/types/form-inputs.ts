export type LoginInput = {
  identifier: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type VerifyEmailInput = {
  otp: string;
};
