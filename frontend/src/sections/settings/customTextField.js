import React from 'react';
import { TextField } from '@mui/material';
import '../../../public/assets/css/customTextField.css'; 

const CustomTextField = ({ handleChange, values }) => (
  <TextField
    fullWidth
    label="Describe in detail"
    name="description"
    onChange={handleChange}
    type="description"
    value={values.description}
    className="custom-textfield" 
  />
);

export default CustomTextField;