import React, { useState } from "react";
import PropTypes from "prop-types";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import Fade from "@mui/material/Fade";
import { Button, Stack, CardActions, TextField, IconButton, InputAdornment  } from "@mui/material";
import { useMutation, QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { UserService } from "services";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AddANewAdminModal = ({ isOpen, onClose}) => {
  const client = new QueryClient();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    phone: ""
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName.match(/^[A-Za-z]+$/)) newErrors.firstName = "First name can only contain letters";
    if (!form.lastName.match(/^[A-Za-z]+$/)) newErrors.lastName = "Last name can only contain letters";
    if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters long";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Email must be in valid format";
    if (Object.values(form).some(field => field === "")) newErrors.general = "All fields must be filled out";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      console.log("Form is valid, submitting...");
      try {
        await mutation.mutateAsync();
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const { firstName, lastName, password, email, phone } = form;
      const response = await UserService.registerAdmin(firstName, lastName, password, email, phone);
      return response;
    },
    onSuccess: (data) => {
      setForm({
        firstName: "",
        lastName: "",
        password: "",
        email: "",
        phone: ""
      });
      onClose();
      alert(data.message);
    },
    onError: (error) => {
      //onClose();
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error("Error adding a new admin:", error);
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      closeAfterTransition
      slots={{ backdrop: StyledBackdrop }}
    >
      <Fade in={isOpen}>
        <ModalContent sx={style}>
          <h2 id="transition-modal-title" className="modal-title">
            Add New Admin
          </h2>
          <Stack spacing={2}>
            <TextField
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleInputChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleInputChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
            />
            {errors.general && (
              <p style={{ color: "red" }}>{errors.general}</p>
            )}
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button variant="contained" color="error" onClick={onClose}>
                Cancel
              </Button>
              <QueryClientProvider client={client}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  disabled={mutation.isLoading}
                >
                  Submit
                </Button>
              </QueryClientProvider>
            </CardActions>
          </Stack>
        </ModalContent>
      </Fade>
    </Modal>
  );
};

const Backdrop = React.forwardRef((props, ref) => {
  const { open, ...other } = props;
  return (
    <Fade in={open}>
      <div ref={ref} {...other} />
    </Fade>
  );
});

Backdrop.propTypes = {
  open: PropTypes.bool,
};

const blue = {
  200: "#99CCFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0066CC",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
};

const ModalContent = styled("div")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
    padding: 24px;
    color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};

    & .modal-title {
      margin: 0;
      line-height: 1.5rem;
      margin-bottom: 8px;
    }

    & .modal-description {
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      color: ${theme.palette.mode === "dark" ? grey[400] : grey[800]};
      margin-bottom: 4px;
    }
  `
);

export default AddANewAdminModal;
