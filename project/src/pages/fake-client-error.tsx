import { useEffect } from 'react'

const FakeClientErrorPage = () => {
  useEffect(() => {
    // @ts-ignore
    fakeUndefinedFunction()
  })

  return <div>A fake client error has been executed.</div>
}

export default FakeClientErrorPage
