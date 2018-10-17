import request from '@/utils/request';

export async function query() {
  return request('/api/real/story');
}

export async function update(params) {
  return request('/api/real/story/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
