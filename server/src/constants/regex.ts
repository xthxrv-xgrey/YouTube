export const NAME_REGEX = /^\p{L}+$/u;

export const USERNAME_REGEX = /^(?!\.)(?!.*\.\.)[a-zA-Z0-9._]{3,30}(?<!\.)$/;

export const CHANNEL_HANDLE_REGEX = /^@[a-zA-Z0-9._-]+$/;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_REGEX = /^.{8,}$/;
