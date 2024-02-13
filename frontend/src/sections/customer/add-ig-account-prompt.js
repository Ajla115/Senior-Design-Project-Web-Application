import React, { useState } from 'react';
import { FormControl, FormLabel , Input, Button } from '@mui/material'; // Fixed imports
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
            <FormControl defaultValue="" required className={styles.containerr}>
                <FormLabel >Username</FormLabel >
                <Input placeholder="Write Instagram username here" onChange={onChange} /> 

                {/* <HelperText /> */}
                <div>
                    <Button>Submit</Button>
                    <Button onClick={() => {
                    closeButton(false)}}>Close</Button> 
                </div>
                {!show}
            </FormControl> 
        </div>
    );
};

export default OpenPromptToAddNewAccount;
