import * as React from "react";
import { useState } from "react";
import dayjs from "dayjs";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField,
  IconButton,
  InputAdornment
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMutation, QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { DMService } from "services";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function WriteDMForm({ closeButton, refetchDMs }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    recipients: '',
    message: '',
    scheduledDateTime: selectedDate.format('YYYY-MM-DD HH:mm:ss')
  });

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    recipients: '',
    message: '',
    scheduledDateTime: ''
  });

  const client = new QueryClient();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
    if (value.trim() !== "") {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    setFormValues({ ...formValues, scheduledDateTime: newValue.format('YYYY-MM-DD HH:mm:ss') });
    if (newValue) {
      setErrors((prevErrors) => ({ ...prevErrors, scheduledDateTime: '' }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {
      email: formValues.email.trim() === '' ? 'Email cannot be empty' : '',
      password: formValues.password.trim() === '' ? 'Password cannot be empty' : '',
      recipients: formValues.recipients.trim() === '' ? 'Recipients cannot be empty' : '',
      message: formValues.message.trim() === '' ? 'Message cannot be empty' : '',
      scheduledDateTime: !formValues.scheduledDateTime ? 'Scheduled DateTime cannot be empty' : ''
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    try {
      await mutation.mutateAsync();
    } catch (error) {
      console.error("Error scheduling a DM:", error);
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const usernamesArray = formValues.recipients.split(',').map(username => username.trim());

      const dmData = {
        email: formValues.email,
        password: formValues.password,
        usernames: usernamesArray,
        message: formValues.message,
        date_and_time: formValues.scheduledDateTime
      };
      console.log(dmData);
      await DMService.addDM(dmData);
      refetchDMs();
    },
    onSuccess: () => {
      alert("DM scheduled successfully");
      closeButton(false);
    },
    onError: (error) => {
      alert(error.message || "Error scheduling a DM");
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Filling of all fields is mandatory." title="Send a programmed DM" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 1200 }}>
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              error={!!errors.email} // Apply error styling if email is empty
              helperText={errors.email} // Display error message for email
            />
            <TextField
              required
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"} // Toggle password visibility
              value={formValues.password}
              onChange={handleChange}
              error={!!errors.password} // Apply error styling if password is empty
              helperText={errors.password} // Display error message for password
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              required
              fullWidth
              label="Recipients"
              name="recipients"
              multiline
              value={formValues.recipients}
              onChange={handleChange}
              error={!!errors.recipients} // Apply error styling if recipients is empty
              helperText={errors.recipients} // Display error message for recipients
            />
            <TextField
              required
              fullWidth
              label="Write message"
              name="message"
              multiline
              value={formValues.message}
              onChange={handleChange}
              error={!!errors.message} // Apply error styling if message is empty
              helperText={errors.message} // Display error message for message
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Schedule DM by choosing date and time"
                value={selectedDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDateTime={dayjs()} // Block past dates and times
              />
            </LocalizationProvider>
            {errors.scheduledDateTime && (
              <Typography color="error">{errors.scheduledDateTime}</Typography>
            )}
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <QueryClientProvider client={client}>
            <Button type="submit" color="success" variant="contained" disabled={mutation.isLoading}>
              Schedule DM
            </Button>
          </QueryClientProvider>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              closeButton(false);
            }}
          >
            Close
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
