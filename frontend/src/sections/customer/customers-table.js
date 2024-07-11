import PropTypes from "prop-types";
import { format } from "date-fns";
import React from "react";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import { InstagramService, UserService } from "services";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteModal from "./delete-instagram-account";

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
                <TableCell>
                  {" "}
                  ID
                  {/* <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  /> */}
                </TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Number of Posts</TableCell>
                <TableCell>No. of Followers</TableCell>
                <TableCell>No. of Following</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Stats</TableCell>
                <TableCell>Other</TableCell>
                <TableCell>User</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {items.map((customer) => {
                const isSelected = selected.includes(customer.id);
                const createdAt = format(customer.createdAt, "dd/MM/yyyy"); */}

              <QueryClientProvider client={client}>
                <InstagramAccountsData accountList={props.accountList} refetch={refetch} />
              </QueryClientProvider>
              {/* })} */}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
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
  refetchAccounts: PropTypes.func,
  refetch: PropTypes.func,
};

function InstagramAccountsData(props) {
  const { accountList, refetch } = props;
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = React.useState(null);

  const handleOpen = (customerId) => {
    setSelectedCustomerId(customerId);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {accountList.message.map((customer) => {
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
            <TableCell>{customer.date_and_time}</TableCell>
            <TableCell>{customer.stats}</TableCell>
            <TableCell>
              <DeleteOutlineIcon onClick={() => handleOpen(customer.id)} />
            </TableCell>
            <TableCell>{customer.user_name}</TableCell>
          </TableRow>
        );
      })}

      <DeleteModal
        isOpen={isModalOpen}
        onClose={handleClose}
        customerId={selectedCustomerId}
        refetch={refetch}
      />
    </>
  );
}
