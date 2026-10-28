export const getGoogleClientId = (): string | null => {
  const value = process.env.GOOGLE_CLIENT_ID?.trim();
  return value && /^\d+-[a-zA-Z0-9_-]+\.apps\.googleusercontent\.com$/.test(value) ? value : null;
};
