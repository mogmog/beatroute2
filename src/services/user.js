import request from '@/utils/request';

export async function query() {
  return request('/api/real/users');
}

export async function queryCurrent() {
  return request('/api/real/currentUser');
}
