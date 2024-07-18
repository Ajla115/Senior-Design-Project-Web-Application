import { useCallback, useState } from "react";
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
import { UserService } from "services";
import { useAuthContext } from "src/contexts/auth-context";
import CustomerServiceTicketsTable from "./customer-service-ticket-table";

export const CustomerHelpService = () => {
  const { user } = useAuthContext();

  const [values, setValues] = useState({
    title: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (value.trim() !== "") {
      setErrors((prevState) => ({
        ...prevState,
        [name]: "",
      }));
    }
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const newErrors = {
        title: values.title.trim() === "" ? "Title cannot be empty" : "",
        description: values.description.trim() === "" ? "Description cannot be empty" : "",
      };
      setErrors(newErrors);

      if (newErrors.title || newErrors.description) {
        return;
      }

      try {
        const response = await UserService.sendEmailToCustomerService(
          values.title,
          values.description
        );
        alert(response.message);
      } catch (error) {
        alert("Error! Email has not been sent.\nCheck your error_log for more information.");
      }
    },
    [values]
  );

  return (
    <>
      {user.is_admin === 1 ? (
        <>
          <CustomerServiceTicketsTable />
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader
              title="Describe your problem"
              subheader="Detailed explanations help us provide a quicker and better solution"
            />
            <Divider />
            <CardContent>
              <Stack spacing={3} sx={{ maxWidth: 1200 }}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  onChange={handleChange}
                  type="title"
                  value={values.title}
                  error={!!errors.title}
                  helperText={errors.title}
                />
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  onChange={handleChange}
                  type="description"
                  value={values.description}
                  multiline
                  error={!!errors.description}
                  helperText={errors.description}
                />
              </Stack>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: "flex-end", marginRight: 0 }}>
              <Button type="submit" color="success" variant="contained">
                Send
              </Button>
              <Button color="error" variant="contained">
                Cancel
              </Button>
            </CardActions>
          </Card>
        </form>
      )}
    </>
  );
};
