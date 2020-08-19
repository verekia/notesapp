import Link from 'next/link'

const LoggedInHeader = ({ user }) => (
  <div>
    <Link href="/dashboard">
      <a>My notes</a>
    </Link>
    <a href="/api/logout">Log out {user && `(${user.email})`}</a>
  </div>
)

export default LoggedInHeader
