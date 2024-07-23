import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  Stack,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { InstagramService } from "services";
import { useMutation, QueryClientProvider, QueryClient } from "@tanstack/react-query";

export const CustomersTable = (props) => {
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
                <TableCell> ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Number of Posts</TableCell>
                <TableCell>No. of Followers</TableCell>
                <TableCell>No. of Following</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Stats</TableCell>
                <TableCell>Other</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {items.map((customer) => {
                const isSelected = selected.includes(customer.id);
                const createdAt = format(customer.createdAt, "dd/MM/yyyy"); */}

              <QueryClientProvider client={client}>
                <InstagramAccountsData />
              </QueryClientProvider>
              {/* })} */}
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

CustomersTable.propTypes = {
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
};

function ShowAccountsData(props) {
  const [data, setData] = useState(null);
  //const posts = useSampleData();
  // console.log(posts);

  //const [selectedCustomerId, setSelectedCustomerId] = React.useState(null);
  const [show, setShow] = useState(true);

  const handleOpen = (customerId) => {
    setSelectedCustomerId(customerId);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const userResponse = await await InstagramService.getAccountDataPerHashtag(props.hashtag_id);
      setData(userResponse);
    },
  });

  useEffect(() => {
    mutation.mutateAsync();
  }, []);

  return (
    <>
      {data &&
        data.message.map((customer) => {
          // const createdAt = format(customer.createdAt, "dd/MM/yyyy");

          return (
            <TableRow hover key={customer.id}>
              <TableCell>{customer.id}</TableCell>

              <TableCell>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography variant="subtitle2">{customer.username}</Typography>
                </Stack>
              </TableCell>
              <TableCell>{customer.post_number}</TableCell>
              <TableCell>{customer.followers_number}</TableCell>
              <TableCell>{customer.followings_number}</TableCell>
            </TableRow>
          );
        })}
    </>
  );
}

export default ShowAccountsData;
