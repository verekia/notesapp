import { useEffect, useState } from 'react'

import useSWR, { ConfigInterface } from 'swr'
import { useRouter } from 'next/router'
import { request } from 'graphql-request'
import { GET_ME_QUERY } from './queries'

// If a client-side only API call hook needs variables in the GraphQL query, use `useMemo:
// https://github.com/vercel/swr/issues/93#issuecomment-552072277
export const graphqlFetcher = (query, vars) => request('/api/client-adapter', query, vars)

export const useGraphQL = (query: string, vars?: Object, config?: Object) =>
  useSWR([query, ...(vars ? [vars] : [])], graphqlFetcher, config)

export const fetcher = async (...args: any[]) => {
  // @ts-ignore
  const res = await fetch(...args)
  if (res.status >= 400 && res.status <= 499) {
    const error = new Error(`Error ${res.status} when fetching`)
    // @ts-ignore
    error.status = res.status
    throw error
  }
  return res.json()
}

interface Options extends ConfigInterface {
  redirectIfLoggedOut?: boolean
  redirectIfLoggedIn?: boolean
}

export const useUser = (initialUser, options?: Options) => {
  const { data: response, error, ...rest } = useGraphQL(GET_ME_QUERY, null, options)
  const data = response?.me[0]
  return { user: data ?? initialUser, isLoading: !error && !data, isError: !!error, ...rest }
}

export const useRedirectIn = (isConfirmedLoggedIn: boolean) => {
  const router = useRouter()
  useEffect(() => {
    isConfirmedLoggedIn && router.replace('/dashboard')
  }, [isConfirmedLoggedIn])
}

export const useRedirectOut = (isConfirmedLoggedOut: boolean) => {
  const router = useRouter()
  useEffect(() => {
    isConfirmedLoggedOut && router.replace('/')
  }, [isConfirmedLoggedOut])
}
