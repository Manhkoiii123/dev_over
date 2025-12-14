export class Request<T> {
  processId?: string;
  data?: T & {
    userAgent: string;
    ip: string;
  };
  constructor(data: Partial<Request<T>>) {
    Object.assign(this, data);
  }
}
export type RequestType<T> = Request<T>;
