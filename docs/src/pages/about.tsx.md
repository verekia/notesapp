**[src/pages/about.tsx](/src/pages/about.tsx)**

```tsx
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import Paper from '@material-ui/core/Paper'

const AboutPage = () => (
  <Container maxWidth="md">
    <Paper style={{ padding: 30 }}>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          About
        </Typography>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc hendrerit varius eleifend.
          Phasellus rutrum maximus bibendum. Nam laoreet orci a orci efficitur tincidunt. Phasellus
          gravida eget libero quis eleifend. Donec vel metus non sem varius sagittis. Pellentesque
          congue orci a nisl dapibus venenatis. Quisque pulvinar erat quis malesuada feugiat. Donec
          a augue et metus condimentum aliquet. Nam suscipit ligula at augue ornare sollicitudin.
          Suspendisse rhoncus tempor mi non convallis.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc hendrerit varius eleifend.
          Phasellus rutrum maximus bibendum. Nam laoreet orci a orci efficitur tincidunt. Phasellus
          gravida eget libero quis eleifend. Donec vel metus non sem varius sagittis. Pellentesque
          congue orci a nisl dapibus venenatis. Quisque pulvinar erat quis malesuada feugiat. Donec
          a augue et metus condimentum aliquet. Nam suscipit ligula at augue ornare sollicitudin.
          Suspendisse rhoncus tempor mi non convallis.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc hendrerit varius eleifend.
          Phasellus rutrum maximus bibendum. Nam laoreet orci a orci efficitur tincidunt. Phasellus
          gravida eget libero quis eleifend. Donec vel metus non sem varius sagittis. Pellentesque
          congue orci a nisl dapibus venenatis. Quisque pulvinar erat quis malesuada feugiat. Donec
          a augue et metus condimentum aliquet. Nam suscipit ligula at augue ornare sollicitudin.
          Suspendisse rhoncus tempor mi non convallis.
        </p>
      </Box>
    </Paper>
  </Container>
)

export default AboutPage

```

<!-- nocomment -->

The About page is a good example of page that can is accessible to both authenticated and unauthenticated users. And since it's not server-side rendered, it's up to the client to figure out if the user is logged in or not to show the relevant header.
