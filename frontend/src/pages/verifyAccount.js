import Head from 'next/head';
import { Box, Container, Stack, Typography } from '@mui/material';
import { VerifyAccount } from 'src/sections/verifyAccount/verify-account';

const Page = () => (
  <>
    <Head>
      <title>
        Verify Account | InstaMetrics
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
            Verify Account
          </Typography>
          < VerifyAccount />
        </Stack>
      </Container>
    </Box>
  </>
);


export default Page;
