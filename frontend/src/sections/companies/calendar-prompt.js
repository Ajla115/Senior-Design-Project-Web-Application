import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Button } from '@mui/material';
export default function BasicDateCalendar({closeButton}) {
  return (
    <div>
    <LocalizationProvider  dateAdapter={AdapterDayjs}>
      <DateCalendar sx={{
        marginLeft: 0
      }} />
    </LocalizationProvider>
    <Button color = 'success' variant = 'contained'>Confirm</Button>
    <Button color = 'warning' variant = 'contained' onClick={() => { closeButton(false)} }>Cancel</Button>
  </div>
  );
}
