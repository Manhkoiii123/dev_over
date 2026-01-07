import { parseToken } from './string.utils';
import { MetadataKeys } from '@common/constants/common.constant';

export function getAccessToken(request: any, keepBearer = false) {
  const token = request.headers.authorization;
  return keepBearer ? token : parseToken(token);
}

export function setUserData<T = unknown>(request: any, data?: T) {
  request[MetadataKeys.USER] = data;
}
