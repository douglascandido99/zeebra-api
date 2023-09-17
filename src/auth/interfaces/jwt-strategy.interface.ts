export interface IJwtStrategy {
  validate(payload: { sub: number; username: string });
}
