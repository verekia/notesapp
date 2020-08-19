import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import Link from 'next/link'

const AboutPage = () => (
  <Container maxWidth="sm">
    <Box my={4}>
      <Typography variant="h4" component="h1" gutterBottom>
        About
      </Typography>
      <Link href="/">
        <a>Go to the main page</a>
      </Link>
    </Box>
  </Container>
)

export default AboutPage
