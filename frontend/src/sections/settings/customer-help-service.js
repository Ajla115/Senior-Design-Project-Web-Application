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
    (event) => {
      event.preventDefault();
    },
    []
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
          <Button color = "success" variant="contained">
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
