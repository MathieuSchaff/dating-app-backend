export interface JwtPayload {
  sub: string;
  email: string;
  userId: string;
  iat?: number;
  exp?: number;
}
