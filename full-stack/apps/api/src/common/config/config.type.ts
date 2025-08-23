export type AuthConfig = {
  accessToken: {
    secret: string;
    expirationTime: number;
  };
  refreshToken: {
    secret: string;
    expirationTime: number;
  };
};
