export class AuthorizedMetadata {
  iat: number;
  exp: number;
  userId: number;
  deviceId: number;

  constructor(payload?: Partial<AuthorizedMetadata>) {
    Object.assign(this, payload);
  }
}
export class AuthorizeResponse {
  valid = false;
  metadata = new AuthorizedMetadata();
  constructor(payload?: Partial<AuthorizeResponse>) {
    Object.assign(this, payload);
  }
}
