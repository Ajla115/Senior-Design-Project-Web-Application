import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import Fade from "@mui/material/Fade";
import {
  Button,
  Stack,
  CardActions,
  Card,
  CardHeader,
  Divider,
  CardContent,
  TextField,
} from "@mui/material";
import { useMutation, QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { DMService } from "services";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const EditDMModal = ({ isOpen, onClose, customerId, initialValues }) => {
  const client = new QueryClient();
  const [selectedDate, setSelectedDate] = useState(dayjs(initialValues.date_and_time));
  const [formValues, setFormValues] = useState({
    recipients: initialValues.recipients,
    message: initialValues.message,
    scheduledDateTime: selectedDate.toISOString(),
  });

  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      scheduledDateTime: selectedDate.toISOString(),
    }));
  }, [selectedDate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await mutation.mutateAsync();
    } catch (error) {
      console.error("Error editing a DM:", error);
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const dmData = {
        message: formValues.message,
        date_and_time: formValues.scheduledDateTime,
      };
      await DMService.editDM(customerId, dmData);
    },
    onSuccess: () => {
      alert("DM edited successfully");
      onClose(); // Close the modal after success
    },
    onError: (error) => {
      alert(error.message || "Error editing a DM");
    },
  });

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
          <h3 id="transition-modal-title" className="modal-title">
            Edit DM with ID: {customerId}
          </h3>

          <form onSubmit={handleSubmit}>
            <Card>
              <Divider />
              <CardContent>
                <Stack spacing={3} sx={{ maxWidth: 1200 }}>
                  <TextField
                    required
                    fullWidth
                    label="Edit message"
                    name="message"
                    multiline
                    value={formValues.message}
                    onChange={handleChange}
                  />

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Change date and time"
                      value={selectedDate}
                      onChange={(newValue) => {
                        setSelectedDate(newValue);
                        setFormValues({ ...formValues, scheduledDateTime: newValue.toISOString() });
                      }}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                      minDateTime={dayjs()} // Block past dates and times
                    />
                  </LocalizationProvider>
                </Stack>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <QueryClientProvider client={client}>
                  <Button
                    type="submit"
                    color="success"
                    variant="contained"
                    disabled={mutation.isLoading}
                  >
                    Edit DM
                  </Button>
                </QueryClientProvider>
                <Button
                  color="error"
                  variant="contained"
                  onClick={() => {
                    onClose();
                  }}
                >
                  Close
                </Button>
              </CardActions>
            </Card>
          </form>
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

const TriggerButton = styled(Button)(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 150ms ease;
    cursor: pointer;
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover {
      background: ${theme.palette.mode === "dark" ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === "dark" ? grey[600] : grey[300]};
    }

    &:active {
      background: ${theme.palette.mode === "dark" ? grey[700] : grey[100]};
    }

    &:focus-visible {
      box-shadow: 0 0 0 4px ${theme.palette.mode === "dark" ? blue[300] : blue[200]};
      outline: none;
    }
  `
);

export default EditDMModal;
