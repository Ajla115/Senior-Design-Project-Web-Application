import Head from 'next/head';
import { Box, Container, Stack, Typography } from '@mui/material';
import { ResetPassword } from 'src/sections/resetPassword/reset-password';

const Page = () => (
  <>
    <Head>
      <title>
        Reset Your Password | InstaMetrics
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Typography variant="h4">
            Reset Your Password
          </Typography>
          <ResetPassword />
        </Stack>
      </Container>
    </Box>
  </>
);


export default Page;
