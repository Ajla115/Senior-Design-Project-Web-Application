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

  const onChange = (event) => {
    const newHashtag = event.target.value;
    setHashtag(newHashtag);
  };

  // const mutation = useMutation({
  //   mutationFn: async () => {
  //     const response = await InstagramService.addHashtag(hashtag);
  //     alert(response.message);
  //     refetchHashtags();
  //     closeButton(false); //to close the modal
  //   },
  //   onSuccess: () => {
  //     setIsSearched(true);
  //     //console.log("bravo");
  //   },
  //   onError: (error) => {
  //     alert("There was a problem while adding a hashtag. Please check your server.");
  //     console.error("Error adding Instagram hashtag:", error);
  //   },
  // });

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await InstagramService.addHashtag(hashtag);
      if (response.status === 200) {
        refetchHashtags();
        closeButton(false); 
        alert(response.message);    
      } else {
        alert("Failed to add hashtag. Go to server for more information.");
        throw new Error(response.message || 'Failed to add hashtag');
      }
    },
    onSuccess: () => {
      setIsSearched(true);
    },
    onError: (error) => {
      console.error("Error adding Instagram hashtag:", error);
    },
  });

  const handleSearch = async () => {
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
          <Stack spacing={3} sx={{ maxWidth: 1200 }}>
            <TextField
              required
              fullWidth
              label="Hashtag"
              name="hashtag"
              onChange={onChange}
              value={hashtag}
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
