import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Button,  CardActions } from '@mui/material';



export default function ResponsiveDateTimePickers({closeButton}) {
  return (
    <div>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DesktopDateTimePicker'
          
        ]}
      >
        <DemoItem label="Schedule DM by choosing date and time">
          <DateTimePicker defaultValue={dayjs('2022-04-17T15:30')} />
        </DemoItem>

      </DemoContainer>
    </LocalizationProvider>
    <CardActions sx={{ justifyContent: 'flex-end', marginRight:0}}>
      
      <Button variant = 'contained' color = "success">Confirm</Button>
      <Button variant = 'contained' color = "error" onClick={() => { closeButton(false)} }>Cancel</Button>
      
      </CardActions>
      </div>
  );
}
