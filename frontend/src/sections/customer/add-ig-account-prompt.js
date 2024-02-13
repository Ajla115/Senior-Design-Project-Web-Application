import React, { useState } from 'react';
//import { FormControl, FormLabel , Input, Button } from '@mui/material'; // Fixed imports
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
import styles from './addacc.module.css';

const OpenPromptToAddNewAccount = ({closeButton}) => {
    const [username, setUsername] = useState("");
    const [show, setShow] = useState(true);

    const onChange = (event) => {
        const newUsername = event.target.value;
        setUsername(newUsername);
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
              <Stack
                spacing={3}
                sx={{ maxWidth: 1200 }}
              >
                <TextField required
                  fullWidth
                  label="Username"
                  name="username"
                  //onChange={handleChange}
                  //type="emal"
                  //value={values.email}
                />
                </Stack>
            
            
            {/* <FormControl defaultValue="" required className={styles.containerr}>
                <FormLabel >Username</FormLabel >
                <Input placeholder="Write Instagram username here" onChange={onChange} /> 

                {/* <HelperText /> */}
                <CardActions sx={{ justifyContent: 'flex-end', marginRight:0}}>
                <Stack spacing={1}
                sx={{maxWidth: 300, marginTop: 2}}
                direction='row' 
                    //justifyContent="left"
                    // alignItems="center"
                    >
                    <Button variant = 'contained' color = "success">Search</Button>
                    <Button variant = 'contained' color = "error" onClick={() => {
                    closeButton(false)}}>Close</Button> 
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
