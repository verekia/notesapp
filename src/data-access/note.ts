import id from '@sharyn/nanoid'

import prisma from '../lib/server/prisma'

export const findNoteById = (id: string) =>
  prisma.note.findOne({ where: { id }, select: { id: true, title: true, content: true } })

export const findNotesByUserId = (userId: string) =>
  prisma.note.findMany({ where: { userId }, select: { id: true, title: true, content: true } })

export const updateNote = ({ id, title, content, userId }) =>
  prisma.note.update({
    data: { title, content },
    where: { id },
  })

export const createNote = ({ userId, title, content }) =>
  prisma.note.create({
    data: {
      id: id(),
      user: { connect: { id: userId } },
      title,
      content,
    },
  })

export const deleteNote = ({ userId, id }) => prisma.note.delete({ where: { id } })
