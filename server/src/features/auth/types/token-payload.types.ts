// ============================================================================
// Types
// ============================================================================

export const enum VerificationTokenPurpose {
  EMAIL_VERIFICATION = "email_verification",
  FORGOT_PASSWORD = "forgot_password",
}

export interface VerificationTokenPayload {
  tokenId: string;
  purpose: VerificationTokenPurpose;
}

export interface AccessTokenPayload {
  userId: string;
}

export interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
}
