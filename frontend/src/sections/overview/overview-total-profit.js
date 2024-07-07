import PropTypes from 'prop-types';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { InstagramService } from 'services'; 

export const OverviewTotalProfit = (props) => {
  const { sx } = props;
  const [value, setValue] = useState('0');

  useEffect(() => {
    const fetchTotalHashtags = async () => {
      const totalHashtags = await InstagramService.getTotalHashtags();
      setValue(totalHashtags);
    };

    fetchTotalHashtags();
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
              Extracted Hashtags
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
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

OverviewTotalProfit.propTypes = {
  value: PropTypes.string,
  sx: PropTypes.object
};
