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
  };

  const mutation = useMutation({
    mutationFn: async () => {
      await InstagramService.addAccount(username);
      refetchAccounts();
      closeButton(false); //to close the modal
    },
    onSuccess: () => {
      setIsSearched(true);

      //console.log("bravo");
    },
    onError: (error) => {
      console.error("Error adding Instagram account:", error);
    },
  });

  const handleSearch = async () => {
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
          <Stack spacing={3} sx={{ maxWidth: 1200 }}>
            <TextField
              required
              fullWidth
              label="Username"
              name="username"
              onChange={onChange}
              value={username}
            />
          </Stack>

          {/* <FormControl defaultValue="" required className={styles.containerr}>
                <FormLabel >Username</FormLabel >
                <Input placeholder="Write Instagram username here" onChange={onChange} /> 

                {/* <HelperText /> */}
          <CardActions sx={{ justifyContent: "flex-end", marginRight: 0 }}>
            <Stack
              spacing={1}
              sx={{ maxWidth: 300, marginTop: 2 }}
              direction="row"
              //justifyContent="left"
              // alignItems="center"
            >
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
      {/* {!show} */}
      {/* </FormControl>   */}
    </div>
  );
};

export default OpenPromptToAddNewAccount;
