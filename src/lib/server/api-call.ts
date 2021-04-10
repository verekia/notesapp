export const ssrApiCall = async (body: Object = {}, token?: string) => {
  const apiResponse = await apiCall(body, token)
  return apiResponse.json()
}

const apiCall = async (body: Object = {}, token?: string) =>
  fetch(`${process.env.HASURA_GRAPHQL_ENDPOINT}/v1/graphql`, {
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

export default apiCall
