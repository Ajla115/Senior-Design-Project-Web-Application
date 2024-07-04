import React from 'react';
import { Modal, Box, Typography, Table, TableBody, TableCell, TableRow, TableHead, Button, Divider } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { InstagramService } from 'services';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  maxHeight: '90%',
  overflowY: 'auto',
  border: 'none' // Remove black frame
};

const ShowAccountsDataModal = ({ open, onClose, hashtagId }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['instagramAccounts', hashtagId],
    queryFn: () => InstagramService.getAccountDataPerHashtag(hashtagId),
    enabled: !!hashtagId, // Only fetch if hashtagId is not null
  });

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>An error occurred: {error.message}</Typography>;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          Accounts for Hashtag: {hashtagId}
        </Typography>
        <Box my={2}>
        <Divider sx={{ borderBottomWidth: 1, borderColor: 'white' }} />
      </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Posts</TableCell>
              <TableCell>Followers</TableCell>
              <TableCell>Followings</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.message.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.username}</TableCell>
                <TableCell>{account.post_number}</TableCell>
                <TableCell>{account.followers_number}</TableCell>
                <TableCell>{account.followings_number}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button onClick={onClose} variant="contained" color="error">
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ShowAccountsDataModal;
