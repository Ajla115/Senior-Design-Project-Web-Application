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
          title="Send us an email describing your problem"
        />
        <Divider />
        <CardContent>
          <Stack
            spacing={3}
            sx={{ maxWidth: 400 }}
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
              label="Describe in detail"
              name="description"
              onChange={handleChange}
              type="description"
              value={values.description}/> 
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">
            Send
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
