import * as React from 'react';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Stack,
    TextField
  } from '@mui/material';

export default function WriteDMForm({closeButton})   {  
    //ovdje je drugacija sintaksa, pa ne treba => prije ove {  zagrade
    return (
        // <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader
              subheader="Filling of all fields is mandatory."
              title="Send an programmed DM"
            />
            <Divider />
            <CardContent>
              <Stack
                spacing={3}
                sx={{ maxWidth: 950 }}
              >
                <TextField required
                  fullWidth
                  label="Email"
                  name="email"
                  //onChange={handleChange}
                  //type="emal"
                  //value={values.email}
                />
                <TextField required
                  fullWidth
                  label="Password"
                  name="password"
                  //onChange={handleChange}
                  //type="password"
                  //value={values.password}
                />
                <TextField required
                  fullWidth
                  label="Recipients"
                  name="recipients"
                  multiline
                  //onChange={handleChange}
                  //type="string"
                  //value={values.recipients}
                />
                <TextField required
                  fullWidth
                  label="Write message"
                  name="message"
                  //onChange={handleChange}
                  //type="string"
                  //value={values.message}
                  multiline
                />

              </Stack>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button color="success" variant="contained"> 
                Update
              </Button>
              <Button color="warning" variant="contained" onClick={() => { closeButton(false)}}>
                Close
              </Button>
            </CardActions>
          </Card>
        // </form>
      );
    };

