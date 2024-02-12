import { FormControl } from '@mui/base/FormControl';
import { Label, StyledInput } from '@mui/material';
import { Button } from '@mui/base/Button';

export const openPromptToAddNewAccount = () => (
    <div>
    <FormControl defaultValue="" required>
        <Label>Name</Label>
        <StyledInput placeholder="Write Instagram username here" />
        {/* <HelperText /> */}
        <div>
        <Button>Confirm</Button>
        <Button>Close</Button> 
        </div>
    </FormControl> 
    </div>
);
