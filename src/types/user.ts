export type RegisterBody = {
  name: string;
  email: string;
  password: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type JwtPayload = {
  userId: string;
  iat?: number;
  exp?: number;
};

export type AuthenticatedUser = {
  userId: string;
};
