import React, { useState } from 'react';
import { FormControl, FormLabel , Input, Button } from '@mui/material'; // Fixed imports
import styles from './addacc.module.css';

const OpenPromptToAddNewAccount = () => {
    const [username, setUsername] = useState("");

    const onChange = (event) => {
        const newUsername = event.target.value;
        setUsername(newUsername);
    };

    return ( 
        <div>
            <FormControl defaultValue="" required className={styles.containerr}>
                <FormLabel >Hi</FormLabel >
                <Input placeholder="Write Instagram username here" onChange={onChange} /> 
                {username}
                {/* <HelperText /> */}
                <div>
                    <Button>Confirm</Button>
                    <Button>Close</Button> 
                </div>
            </FormControl> 
        </div>
    );
};

export default OpenPromptToAddNewAccount;
