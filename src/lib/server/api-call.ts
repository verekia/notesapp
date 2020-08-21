import { getSession } from './iron'

export const ssrApiCall = async (req, body) => {
  const userId = (await getSession(req))?.userId ?? null
  const apiResponse = await apiCall(body, userId)
  const { data } = await apiResponse.json()
  return data
}

const apiCall = async (body: Object = {}, userId?: string) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
  }
  if (userId) {
    headers['X-Hasura-Role'] = 'user'
    headers['X-Hasura-User-ID'] = userId
  } else {
    headers['X-Hasura-Role'] = 'public'
  }

  return fetch(`${process.env.HASURA_GRAPHQL_ENDPOINT}/v1/graphql`, {
    method: 'post',
    body: JSON.stringify(body),
    headers,
  })
}

export default apiCall
