import * as React from 'react';
import { useState } from 'react';
import BasicDateCalendar from './calendar-prompt';
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
    const [calendar, setCalendar] = useState(false); //dm prompt is not seen at the beginning
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
                <Stack //this small stack is for two buttons
                //and this small stack is found to be partb of the bigger stack as well
                //which is this whole card stack
                spacing={4}
                sx={{ maxWidth: 300}}
                direction='row'
                >
                <Button variant="outlined" onClick = {() => {setCalendar(true)}}>Calendar</Button>
                <Button variant="outlined">Time</Button>
                </Stack>
                {calendar&& <BasicDateCalendar closeButton={setCalendar}/>}
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

