import React from 'react';
import { Modal, Box, Typography, Table, TableBody, TableCell, TableRow, Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { InstagramService } from 'services';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '90%',
  overflowY: 'auto'
};

const AccountsModal = ({ open, onClose, hashtagId }) => {
  const { data, error, isLoading } = useQuery(['instagramAccounts', hashtagId], () => InstagramService.getAccountDataPerHashtag(hashtagId));

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
        <Table>
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
        <Button onClick={onClose}>Close</Button>
      </Box>
    </Modal>
  );
};

export default AccountsModal;
