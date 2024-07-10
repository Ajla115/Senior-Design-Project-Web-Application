import React, { useState } from "react";
import { useMutation, QueryClientProvider, QueryClient } from "@tanstack/react-query";
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
import { InstagramService } from "services";

const OpenPromptToAddNewAccount = ({ closeButton, refetchAccounts }) => {
  const client = new QueryClient();
  const [isSearched, setIsSearched] = useState(false);
  const [username, setUsername] = useState("");
  const [show, setShow] = useState(true);

  const onChange = (event) => {
    const newUsername = event.target.value;
    setUsername(newUsername);
    if (newUsername.trim() !== "") {
      setUsernameError("");
    }
  };

  // This is to handle error message for the username field
  const [usernameError, setUsernameError] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await InstagramService.addAccount(username);
      return response;
      
    },
    onSuccess: (response) => {
      setIsSearched(true);
      alert(response.message);
      refetchAccounts();
      closeButton(false);
    },
    onError: (error) => {
      alert("Error adding a new username. Check your server for more information.");
      console.error("Error adding Instagram account:", error);
    },
  });

  const handleSearch = async () => {
    if (username.trim() === "") {
      setUsernameError("Username cannot be empty");
      return;
    }
    console.log("Searching");
    try {
      await mutation.mutateAsync();
    } catch (error) {
      console.error("Error adding Instagram account:", error);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader
          subheader="Please enter wanted instagram username"
          title="Retrieve account's data"
        />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 1500 }}>
            <TextField
              required
              fullWidth
              label="Username"
              name="username"
              onChange={onChange}
              value={username}
              error={!!usernameError} // Apply error styling if usernameError is not empty
              helperText={usernameError} // Display the error message
            />
          </Stack>
          <CardActions sx={{ justifyContent: "flex-end", marginRight: 0 }}>
            <Stack spacing={1} sx={{ maxWidth: 300, marginTop: 2 }} direction="row">
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  closeButton(false);
                }}
              >
                Close
              </Button>
              <QueryClientProvider client={client}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSearch}
                  disabled={mutation.isLoading}
                >
                  Add account
                </Button>
              </QueryClientProvider>
            </Stack>
          </CardActions>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpenPromptToAddNewAccount;
