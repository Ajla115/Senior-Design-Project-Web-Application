import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Card,
  CardActions,
  CardHeader,
  Box,
} from '@mui/material';

import { UserService } from 'services';

export const VerifyAccount = () => {
  const router = useRouter();
  const [registerToken, setRegisterToken] = useState('');

  useEffect(() => {
    if (router.isReady) {
      const { register_token } = router.query;
      if (register_token) {
        setRegisterToken(register_token);
      }
    }
  }, [router.isReady, router.query]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        if (!registerToken) {
          alert("Error! No registration token found.");
          return;
        }
        const response = await UserService.verifyAccount(registerToken);
        alert(response.message);
        router.push("/auth/login/");
      } catch (error) {
        console.log(error);
        alert("Error! Unable to verify your email.");
      }
    },
    [registerToken]
  );

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          title="Click the Button to Verify Your Account"
          subheader="If you don't verify your account, you won't be able to login."
        />
        <CardActions>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              mt: 2,
            }}
          >
            <Button
              type="submit"
              color="success"
              variant="contained"
              sx={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
            >
              Click here to verify your account
            </Button>
          </Box>
        </CardActions>
      </Card>
    </form>
  );
};
