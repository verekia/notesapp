import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.HASURA_GRAPHQL_JWT_KEY

export interface JWTPayload {
  issuer: string
  'https://hasura.io/jwt/claims': {
    'x-hasura-allowed-roles': string[]
    'x-hasura-default-role': string
    'x-hasura-user-id': string
  }
}

export const createJWT = (payload: {
  issuer: string
  publicAddress: string
  email: string
  userId: string
}) => {
  const { userId, ...rest } = payload

  return jwt.sign(
    {
      ...rest,
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': ['user', 'public'],
        'x-hasura-default-role': 'user',
        'x-hasura-user-id': userId,
      },
    },
    JWT_SECRET,
    { expiresIn: '7 days' } // Same as cookies
  )
}

export const decodeJWT = (token: string) => jwt.verify(token, JWT_SECRET) as JWTPayload
