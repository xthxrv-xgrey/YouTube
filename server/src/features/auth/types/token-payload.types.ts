export type AccessTokenPayload = {
  userId: string;
  sessionId: string;
};

export type RefreshTokenPayload = {
  userId: string;
  sessionId: string;
};

export type VerificationTokenPayload = {
  tokenId: string;
  purpose: "email_verification" | "password_reset";
};
