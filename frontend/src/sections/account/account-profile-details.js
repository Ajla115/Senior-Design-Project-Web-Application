import { useCallback, useState, useEffect } from "react";
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
  Unstable_Grid2 as Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import TransitionsModal from "./deactive-account-modal";
import { Visibility, VisibilityOff } from "@mui/icons-material"; //needed for password toggling
import { useAuthContext } from "src/contexts/auth-context";

const states = [
  {
    value: "alabama",
    label: "Alabama",
  },
  {
    value: "new-york",
    label: "New York",
  },
  {
    value: "san-francisco",
    label: "San Francisco",
  },
  {
    value: "los-angeles",
    label: "Los Angeles",
  },
];

export const AccountProfileDetails = () => {
  const { user } = useAuthContext();
  // const [initialValues, setInitialValues] = useState({
  //   first_name: "Anika",
  //   last_name: "Visser",
  //   email: "demo@devias.io",
  //   //password: "anika123",
  //   // state: 'los-angeles',
  //   // country: 'USA'
  // });

  const [initialValues, setInitialValues] = useState(user);

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword); //setting the state of visibility
  };

  const [isChanged, setIsChanged] = useState(false); //this will track if input in any three fields changes
  const [values, setValues] = useState(initialValues); //this will keep track, if there are no changes, disable Save button again
  console.log(values);
  useEffect(() => {
    setInitialValues(values); //this I need to keep track of the first values in the fields
  }, []);

  const handleChange = useCallback((event) => {
    setIsChanged(true); //if we are triggering this function, it means something has changes
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    //this will compare current values with the initial values
    //and it will set the state of setIsChanged
    setIsChanged(!compareValues(values, initialValues));
  }, [values, initialValues]);

  const compareValues = (value1, value2) => {
    for (let i in value1) {
      if (value1[i] !== value2[i]) {
        return false;
      }
    }
    return true;
  };

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <Stack
          spacing={37}
          // sx={{maxWidth: 300, marginTop: 2}}
          direction="row"
        >
          <CardHeader subheader="The information can be edited" title="Profile" />
          <CardActions sx={{ justifyContent: "flex-end", marginRight: 0 }}>
            {/* <Button variant = 'outlined' color = 'error'>Deactive your account</Button> */}
            <TransitionsModal />
          </CardActions>
        </Stack>
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
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
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last name"
                  name="last_name"
                  onChange={handleChange}
                  required
                  value={values.last_name}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                />
              </Grid>
              {/* <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton color="primary" onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid> */}
              <Grid xs={12} md={6}>
                {/* <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  onChange={handleChange}
                  required
                  value={values.country}
                /> */}
              </Grid>
              <Grid xs={12} md={6}>
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
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained" disabled={!isChanged}>
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
