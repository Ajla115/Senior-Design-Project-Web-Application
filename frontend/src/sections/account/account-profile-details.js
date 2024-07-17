import { useCallback, useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // needed for password toggling
import { useAuthContext } from "src/contexts/auth-context";
import { UserService } from "services";
import { useRouter } from "next/router";
import DeleteAccountModal from "./deactive-account-modal";
import AddANewAdminModal from "./add-a-new-admin-modal";
import AdminTableModal from "./admin-table-modal";
import UserTableModal from "./user-table-modal";

export const AccountProfileDetails = () => {
  const router = useRouter();
  const { user } = useAuthContext();

  //console.log("User values are: ", user.is_admin);

  const [initialValues, setInitialValues] = useState(user);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    repeat: false,
  }); // Initialize showPassword state as an object
  const [isChanged, setIsChanged] = useState(false);
  const [values, setValues] = useState(initialValues);

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

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
      await UserService.userDataUpdate(
        values.first_name,
        values.last_name,
        values.email,
        values.phone
      );
      alert("User details updated successfully");
      router.push("/auth/login");
      setIsChanged(false);
    } catch (error) {
      console.error("Error updating user details:", error);
      alert(error.message || "Failed to update user details"); // shows error message to the user
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

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminTableModalOpen, setIsAdminTableModalOpen] = useState(false);
  const [isUserTableModalOpen, setIsUserTableModalOpen] = useState(false);
  
  const handleOpenAdminTableModal = () => {
    setIsAdminTableModalOpen(true);
  };

  const handleCloseAdminTableModal = () => {
    setIsAdminTableModalOpen(false);
  };

  const handleOpenUserTableModal = () => {
    setIsUserTableModalOpen(true);
  };

  const handleCloseUserTableModal = () => {
    setIsUserTableModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <Box sx={{ mt: 5 }}>
          {/* Admin Buttons */}
          {user.is_admin === 1 && ( // Conditionally render admin buttons if user is admin
            <Box mb={3} ml={5} mr={5}>
              <Grid container spacing={2} justifyContent="space-around">
                <Grid item xs={12} sm={4} md={3}>
                  <Button fullWidth variant="contained" color="primary" onClick={handleOpenModal}>
                    Add New Admin
                  </Button>
                </Grid>
                <AddANewAdminModal
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                />
                <Grid item xs={12} sm={4} md={3}>
                <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={handleOpenAdminTableModal}
                  >
                    Delete Admin
                  </Button>
                </Grid>
                <AdminTableModal
                  isOpen={isAdminTableModalOpen}
                  onClose={handleCloseAdminTableModal}
                  refetch={() => {}}
                />
                <Grid item xs={12} sm={4} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="warning"
                    onClick={handleOpenUserTableModal}
                  >
                    Manage All Users
                  </Button>
                </Grid>
                <UserTableModal
                  isOpen={isUserTableModalOpen}
                  onClose={handleCloseUserTableModal}
                  refetch={() => {}}
                />
              </Grid>
            </Box>
          )}
          {/* End of Admin Buttons */}
        </Box>
        <CardHeader
          title="Profile"
          subheader="The information can be edited"
          action={<DeleteAccountModal />}
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="First name"
                  name="first_name"
                  onChange={handleChange}
                  required
                  value={values.first_name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Last name"
                  name="last_name"
                  onChange={handleChange}
                  required
                  value={values.last_name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                />
              </Grid>
              <Grid item xs={12}>
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
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            disabled={!isChanged}
            onClick={() => handleSaveDetails(values)}
          >
            Save details
          </Button>
        </CardActions>
      </Card>
      <Box my={3}>
        <Divider sx={{ borderBottomWidth: 2, borderColor: "white" }} />
      </Box>
      <Card>
        <CardHeader subheader="Change Your Password here" title="Change Password" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="password"
                  type={showPassword.current ? "text" : "password"} // Use state to control password visibility
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  value={password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          color="primary"
                          onClick={() => togglePasswordVisibility("current")} // Toggle visibility for current password
                          edge="end"
                        >
                          {showPassword.current ? <VisibilityOff /> : <Visibility />}{" "}
                          {/* Use showPassword.current */}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword" // Updated to match the state key
                  type={showPassword.new ? "text" : "password"} // Use state to control password visibility
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  value={newPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          color="primary"
                          onClick={() => togglePasswordVisibility("new")} // Toggle visibility for new password
                          edge="end"
                        >
                          {showPassword.new ? <VisibilityOff /> : <Visibility />}{" "}
                          {/* Use showPassword.new */}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Repeat new password"
                  name="repeatPassword" // Updated to match the state key
                  type={showPassword.repeat ? "text" : "password"} // Use state to control password visibility
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  required
                  value={repeatPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          color="primary"
                          onClick={() => togglePasswordVisibility("repeat")} // Toggle visibility for repeat password
                          edge="end"
                        >
                          {showPassword.repeat ? <VisibilityOff /> : <Visibility />}{" "}
                          {/* Use showPassword.repeat */}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider sx={{ borderBottomWidth: 2, borderColor: "grey" }} />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={handleChangePassword}>
            Change Password
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
