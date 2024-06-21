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
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // needed for password toggling
import { useAuthContext } from "src/contexts/auth-context";
import { UserService } from "services";
import { useRouter } from "next/router"; // corrected import
import DeleteAccountModal from "./deactive-account-modal"; // corrected import

const states = [
  { value: "alabama", label: "Alabama" },
  { value: "new-york", label: "New York" },
  { value: "san-francisco", label: "San Francisco" },
  { value: "los-angeles", label: "Los Angeles" },
];

export const AccountProfileDetails = () => {
  const router = useRouter();
  const { user } = useAuthContext();

  const [initialValues, setInitialValues] = useState(user);
  const [showPassword, setShowPassword] = useState(false);
  const [isChanged, setIsChanged] = useState(false); // tracks if input in any three fields changes
  const [values, setValues] = useState(initialValues); // keeps track of current values

  const [password, setPassword] = useState(''); // added state for password
  const [newPassword, setNewPassword] = useState(''); // added state for new_password
  const [repeatPassword, setRepeatPassword] = useState(''); // added state for repeat_password

  useEffect(() => {
    setInitialValues(values); // keeps track of the initial values in the fields
  }, []);

  const handleChange = useCallback((event) => {
    setIsChanged(true); // triggers if something has changed
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    // compares current values with the initial values and sets the state of setIsChanged
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

  const handleSaveDetails = async (values) => {
    try {
      await UserService.userDataUpdate(values.first_name, values.last_name, values.email, values.phone);
      alert('User details updated successfully');
      router.push('/auth/login');
      setIsChanged(false);
    } catch (error) {
      console.error('Error updating user details:', error);
      alert(error.message || 'Failed to update user details'); // shows error message to the user
    }
  };

  const handleChangePassword = async () => {
    try {
      await UserService.changePassword(password, newPassword, repeatPassword);
      alert("Password successfully changed.");
      router.push("/auth/login");
    } catch (error) {
      console.error("Error updating password:", error);
      alert(error.message || "Failed to change password");
    }
  };

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <Stack spacing={3} direction="row">
          <CardHeader subheader="The information can be edited" title="Profile" />
          <CardActions sx={{ justifyContent: "flex-end", marginRight: 0 }}>
            <DeleteAccountModal />
          </CardActions>
        </Stack>
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First name"
                  name="first_name"
                  onChange={handleChange}
                  required
                  value={values.first_name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last name"
                  name="last_name"
                  onChange={handleChange}
                  required
                  value={values.last_name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  onChange={handleChange}
                  required
                  value={values.phone}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained" disabled={!isChanged} onClick={() => handleSaveDetails(values)}>
            Save details
          </Button>
        </CardActions>
      </Card>
      <Divider />
      <Card>
        <CardHeader subheader="Change Your Password here" title="Change Password" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  value={password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton color="primary" onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="new_password"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  value={newPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton color="primary" onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Repeat new password"
                  name="repeat_password"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  required
                  value={repeatPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton color="primary" onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={handleChangePassword}>
            Change Password
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
