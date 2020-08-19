import { useEffect, useState } from 'react'

import useSWR, { ConfigInterface } from 'swr'
import { useRouter } from 'next/router'

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

export const useAPI = (
  key: any,
  options: Options = { redirectIfLoggedOut: false, redirectIfLoggedIn: false }
) => {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState()
  const { redirectIfLoggedOut, redirectIfLoggedIn, ..._swrConfig } = options
  const swrConfig: ConfigInterface = { ..._swrConfig }

  const { data, error, ...rest } = useSWR(key, fetcher, swrConfig)

  // useEffect(() => {
  //   if (redirectIfLoggedOut && error?.status === 401) {
  //     router.replace('/')
  //   }
  //   if (redirectIfLoggedIn && error?.status !== 401) {
  //     router.replace('/dashboard')
  //   }
  // }, [error?.status])

  return { isLoading: !error && !data, isError: !!error, data: data, error: error, ...rest }
}

export const useUser = (initialUser, options?: Options) => {
  const { data, error, ...rest } = useAPI(`/api/user`, options)
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
