import PropTypes from 'prop-types';
import React from 'react';
import { Box, Card, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography, Button } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteModal from './delete-instagram-hashtag';
import ShowAccountsDataModal from './show-account-table-modal';

export const HashtagsTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    refetch,
  } = props;

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        onError: () => {},
      },
    },
  });

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Number of Accounts</TableCell>
                <TableCell>Show Accounts</TableCell>
                <TableCell>Other</TableCell>
                <TableCell>User</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <QueryClientProvider client={client}>
                <InstagramHashtagsData items={items} refetch={refetch} />
              </QueryClientProvider>
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      {/* <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      /> */}
    </Card>
  );
};

HashtagsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
  refetch: PropTypes.func, 
};

function InstagramHashtagsData(props) {
  const { items, refetch } = props; 
  const [isAccountsModalOpen, setIsAccountsModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedHashtagId, setSelectedHashtagId] = React.useState(null);

  const handleOpenAccountsModal = (hashtagId) => {
    setSelectedHashtagId(hashtagId);
    setIsAccountsModalOpen(true);
  };

  const handleCloseAccountsModal = () => {
    setIsAccountsModalOpen(false);
  };

  const handleOpenDeleteModal = (hashtagId) => {
    setSelectedHashtagId(hashtagId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      {items.map((hashtag) => (
        <TableRow hover key={hashtag.id}>
          <TableCell>{hashtag.id}</TableCell>
          <TableCell>
            <Stack alignItems="center" direction="row" spacing={1}>
              <Typography variant="subtitle2">{hashtag.hashtag_name}</Typography>
            </Stack>
          </TableCell>
          <TableCell>{hashtag.number_of_followers}</TableCell>
          <TableCell>
            <Button onClick={() => handleOpenAccountsModal(hashtag.id)} variant="text">
              See accounts
            </Button>
          </TableCell>
          <TableCell>
            <DeleteOutlineIcon onClick={() => handleOpenDeleteModal(hashtag.id)} />
          </TableCell>
          <TableCell>{hashtag.user_name}</TableCell>
        </TableRow>
      ))}
      <ShowAccountsDataModal open={isAccountsModalOpen} onClose={handleCloseAccountsModal} hashtagId={selectedHashtagId} />
      <DeleteModal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} hashtagId={selectedHashtagId} refetch={refetch} />
    </>
  );
}
