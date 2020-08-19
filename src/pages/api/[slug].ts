import { NextApiRequest as Req, NextApiResponse as Res } from 'next'

import { findUserByEmail, createUser, findUserById } from '../../data-access/user'
import {
  findNotesByUserId,
  findNoteById,
  updateNote,
  createNote,
  deleteNote,
} from '../../data-access/note'
import { getSession } from '../../lib/server/iron'
import { setTokenCookie, removeTokenCookie } from '../../lib/server/auth-cookies'
import { encryptSession } from '../../lib/server/iron'
import magic from '../../lib/server/magic'

// This endpoint is only used by SWR

export default async (req: Req, res: Res) => {
  const { slug } = req.query
  const userId = (await getSession(req))?.userId

  switch (slug) {
    case 'user':
      if (!userId) {
        return res.status(401).end()
      }
      res.status(200).json(await findUserById(userId))
      break
    case 'login':
      try {
        const didToken = req.body
        const metadata = await magic.users.getMetadataByToken(didToken)
        let foundUser: any = await findUserByEmail(metadata.email)
        console.log(foundUser)
        if (!foundUser) {
          foundUser = await createUser(metadata.email)
        }
        const session = { ...metadata, userId: foundUser?.id }
        const authToken = await encryptSession(session)
        setTokenCookie(req, res, authToken)
        res.status(200).end()
      } catch (error) {
        res.status(error.status || 500).end(error.message)
      }
      break
    case 'notes':
      if (!userId) {
        return res.status(401).end()
      }
      res.status(200).json(await findNotesByUserId(userId))
      break
    case 'note':
      const id = req.query.id as string
      res.status(200).json(await findNoteById(id))
      break
    case 'edit-note':
      if (!userId) {
        return res.status(401).end()
      }
      await updateNote({
        userId,
        id: req.body.id,
        title: req.body.title,
        content: req.body.content,
      })
      res.status(200).end()
      break
    case 'create-note':
      if (!userId) {
        return res.status(401).end()
      }
      await createNote({ userId, title: req.body.title, content: req.body.content })
      res.status(200).end()
      break
    case 'delete-note':
      if (!userId) {
        return res.status(401).end()
      }
      await deleteNote({ userId, id: req.body.id })
      res.status(200).end()
      break
    case 'logout':
      const issuer = (await getSession(req))?.issuer
      await magic.users.logoutByIssuer(issuer)
      removeTokenCookie(res)
      res.writeHead(302, { Location: '/' }).end()
      break
    default:
      res.status(404).end()
      break
  }
}
