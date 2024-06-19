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

import {CustomTextField} from 'src/sections/settings/customTextField';
import { UserService } from 'services';

export const CustomerHelpService = () => {
  const [values, setValues] = useState({
    title: '',
    description: ''
  });

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        const response = await UserService.sendEmailToCustomerService(values.title, values.description);
        alert(response.message);
        // console.log(response);
      } catch (error) {
        //console.error('Error sending email:', error);
        alert("Error! Email has been not sent.\nCheck your error_log for more information.");
      }
    },
    [values]
  );


  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          title="Describe your problem"
          subheader = "Detailed explanations help us provide a quicker and better solution"
        />
        <Divider />
        <CardContent>
          <Stack
            spacing={3}
            sx={{ maxWidth: 1200 }}
          >
            <TextField
              fullWidth
              label="Title"
              name="title"
              onChange={handleChange}
              type="title"
              value={values.title}
            />
            {/* <CustomTextField /> */}
              <TextField fullWidth
              label="Description"
              name="description"
              onChange={handleChange}
              type="description"
              value={values.description}
              multiline/>
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end', marginRight:0 }}>
        <Button type="submit" color="success" variant="contained">
            Send
          </Button>
          <Button color = "error" variant="contained"> 
            Cancel
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

