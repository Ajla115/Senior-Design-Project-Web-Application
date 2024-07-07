import PropTypes from 'prop-types';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { InstagramService } from 'services'; 

export const OverviewBudget = (props) => {
  const { difference, positive = false, sx } = props;
  const [value, setValue] = useState('0');

  useEffect(() => {
    const fetchTotalInstagramAccounts = async () => {
      const totalAccounts = await InstagramService.getTotalAccounts();
      setValue(totalAccounts);
    };

    fetchTotalInstagramAccounts();
  }, []);

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              variant="overline"
            >
              Number of mined IG Accounts
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'error.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <UsersIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
          sx={{ mt: 2 }}
        >
          <Stack
            alignItems="center"
            direction="row"
            spacing={0.5}
          >
            <Typography
              color="text.secondary"
              variant="caption"
            >
              Since February
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewBudget.propTypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string.isRequired
};
