import id from '@sharyn/nanoid'

import prisma from '../lib/server/prisma'

export const findUserByEmail = (email: string) => prisma.user.findOne({ where: { email } })

export const createUser = (email: string) =>
  prisma.user.create({
    data: { id: id(), email },
    select: { id: true },
  })

export const findUserById = (id: string) =>
  prisma.user.findOne({ where: { id }, select: { email: true } })
