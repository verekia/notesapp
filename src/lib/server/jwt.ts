import jwt from 'jsonwebtoken'

const JWT_SECRET = JSON.parse(process.env.HASURA_GRAPHQL_JWT_SECRET).key

export interface JWTPayload {
  issuer: string
  'https://hasura.io/jwt/claims': {
    'x-hasura-allowed-roles': string[]
    'x-hasura-default-role': string
    'x-hasura-user-id': string
  }
}

export const createJWT = (payload: { userId: string }) => {
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
    { expiresIn: '8 hours' } // Same as cookies
  )
}

export const decodeJWT = (token: string) => jwt.verify(token, JWT_SECRET) as JWTPayload
