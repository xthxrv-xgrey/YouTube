export type AccessTokenPayload = {
  userId: string;
  sessionId: string;
};

export type RefreshTokenPayload = {
  userId: string;
};

export type VerificationTokenPayload = {
  pendingUserId: string;
  purpose: "email_verification";
};
