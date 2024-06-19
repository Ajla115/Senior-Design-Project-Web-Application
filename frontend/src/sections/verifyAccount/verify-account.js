import { useCallback, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField
} from '@mui/material';

import { UserService } from 'services';

export const VerifyAccount = () => {
  

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        const response = await UserService.sendEmailToCustomerService(values.title, values.description);
        alert(response.message);
      } catch (error) {
        alert("Error! Unable to verify your email.");
      }
    },
    [values]
  );


  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          title="Click the Button to Verify Your Account"
          subheader = "If you don't verify your account, you won't be able to login."
        />
        
        <Button type="submit" color="success" variant="contained">
            Click here to verify your account
          </Button>
          <Button color = "error" variant="contained"> 
            Cancel
          </Button>
      </Card>
    </form>
  );
};
