import Head from 'next/head';
import { Box, Container, Stack, Typography } from '@mui/material';
import { ForgetPassword } from 'src/sections/forgetPassword/forget-password';

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
          <ForgetPassword />
        </Stack>
      </Container>
    </Box>
  </>
);


export default Page;
