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


const OpenPromptToAddNewHashtag = ({ closeButton, refetchHashtags }) => {
  const client = new QueryClient();
  const [isSearched, setIsSearched] = useState(false);
  const [hashtag, setHashtag] = useState("");
  const [show, setShow] = useState(true);

  // State to handle the error message for the hashtag field
  const [hashtagError, setHashtagError] = useState("");

  const onChange = (event) => {
    const newHashtag = event.target.value;
    setHashtag(newHashtag);
    if (newHashtag.trim() !== "") {
      setHashtagError("");
    }
  };


  const mutation = useMutation({
    mutationFn: async () => {
      const response = await InstagramService.addHashtag(hashtag);
      return response;
    },
    onSuccess: (response) => {
      setIsSearched(true);
      alert(response.message);
      refetchHashtags();
      closeButton(false);
    },
    onError: (error) => {
      alert("Error adding a new hashtag. Check your server for more information.");
      console.error("Error adding Instagram hashtag:", error);
    },
  });

  const handleSearch = async () => {
    if (hashtag.trim() === "") {
      setHashtagError("Hashtag cannot be empty");
      return;
    }
    console.log("Searching");
    try {
      await mutation.mutateAsync();
    } catch (error) {
      console.error("Error adding Instagram hashtag:", error);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader
          subheader="Please enter wanted instagram hashtag"
          title="Retrieve hashtag's accounts"
        />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 1500 }}>
            <TextField
              required
              fullWidth
              label="Hashtag"
              name="hashtag"
              onChange={onChange}
              value={hashtag}
              error={!!hashtagError} // Apply error styling if hashtagError is not empty
              helperText={hashtagError} // Display the error message
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
                  Search
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

export default OpenPromptToAddNewHashtag;
