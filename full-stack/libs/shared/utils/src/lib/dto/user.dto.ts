export type CreateUserDto = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
};

export type AuthLoginDto = {
  email: string;
  password: string;
};

export type AuthRefreshResponseDto = {
  access_token: string;
  refresh_token: string;
};

export type UserResponseDto = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
};

export type AuthResponseDto = AuthRefreshResponseDto & {
  user: UserResponseDto;
};

export type AuthPayload = {
  id: number;
  role: string;
};

export enum TokenType {
  ACCESS_TOKEN = 'AccessToken',
  REFRESH_TOKEN = 'RefreshToken',
}

export type UpdateUserDto = {
  first_name: string;
  last_name: string;
};
