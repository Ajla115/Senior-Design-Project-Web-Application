import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import TransitionsModal from './deactive-account-modal';

const states = [
  {
    value: 'alabama',
    label: 'Alabama'
  },
  {
    value: 'new-york',
    label: 'New York'
  },
  {
    value: 'san-francisco',
    label: 'San Francisco'
  },
  {
    value: 'los-angeles',
    label: 'Los Angeles'
  }
];

export const AccountProfileDetails = () => {
  const [values, setValues] = useState({
    first_name: 'Anika',
    last_name: 'Visser',
    email: 'demo@devias.io',
    // phone: '',
    // state: 'los-angeles',
    // country: 'USA'
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
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card>
      <Stack spacing={37}
                // sx={{maxWidth: 300, marginTop: 2}}
                direction='row' >
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <CardActions sx={{ justifyContent: 'flex-end', marginRight:0}}>
        {/* <Button variant = 'outlined' color = 'error'>Deactive your account</Button> */}
        <TransitionsModal />
        </CardActions></Stack>
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  // helperText="Please specify the first name"
                  label="First name"
                  name="first_name"
                  onChange={handleChange}
                  required
                  value={values.first_name}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Last name"
                  name="last_name"
                  onChange={handleChange}
                  required
                  value={values.last_name}
                />
              </Grid>
              <Grid
                xs={12}
                md={12}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                {/* <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  onChange={handleChange}
                  type="number"
                  value={values.phone}
                /> */}
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                {/* <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  onChange={handleChange}
                  required
                  value={values.country}
                /> */}
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                {/* <TextField
                  fullWidth
                  label="Select State"
                  name="state"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.state}
                >
                  {states.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField> */}
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
