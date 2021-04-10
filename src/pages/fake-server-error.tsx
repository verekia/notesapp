const FakeServerErrorPage = () => <div>A fake server error has been executed.</div>

export const getServerSideProps = () => {
  // @ts-ignore
  fakeUndefinedFunction()

  return { props: {} }
}

export default FakeServerErrorPage
