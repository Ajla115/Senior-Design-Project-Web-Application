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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMutation, QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { DMService} from "services";

export default function WriteDMForm({ closeButton }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    recipients: '',
    message: '',
    scheduledDateTime: selectedDate.toISOString()
  });

  const client = new QueryClient();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
    },
    onSuccess: () => {
      alert("DM scheduled successfully");
    },
    onError: (error) => {
      alert(error.message || "Error scheduling a DM");
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Filling of all fields is mandatory." title="Send a programmed DM" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 1200 }}>
            <TextField required fullWidth label="Email" name="email" value={formValues.email} onChange={handleChange} />
            <TextField required fullWidth label="Password" name="password" type="password" value={formValues.password} onChange={handleChange} />
            <TextField required fullWidth label="Recipients" name="recipients" multiline value={formValues.recipients} onChange={handleChange} />
            <TextField required fullWidth label="Write message" name="message" multiline value={formValues.message} onChange={handleChange} />
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Schedule DM by choosing date and time"
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
