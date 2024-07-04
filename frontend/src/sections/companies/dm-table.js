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
import { DMService} from "services";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteDMModal from "./delete-dm-modal";

export const DMTable = (props) => {
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
                <TableCell>Email (IG username)</TableCell>
                <TableCell>Recipients</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Other</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {items.map((customer) => {
                const isSelected = selected.includes(customer.id);
                const createdAt = format(customer.createdAt, "dd/MM/yyyy"); */}

              <QueryClientProvider client={client}>
                <DMAccountsData accountList={props.accountList} />
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

DMTable.propTypes = {
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

function DMAccountsData(props) {
  //const posts = useSampleData();
  // console.log(posts);

  //This is all for deleting a modal
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
      {props.accountList.message.map((customer) => (
          <TableRow hover key={customer.id}>
            <TableCell>
              {/* <Checkbox
                checked={isSelected}
                onChange={(event) => {
                  if (event.target.checked) {
                    onSelectOne?.(customer.id);
                  } else {
                    onDeselectOne?.(customer.id);
                  }
                }}
              /> */}
              {customer.id}
            </TableCell>

            <TableCell>
              <Stack alignItems="center" direction="row" spacing={1}>
                <Typography variant="subtitle2">{customer.users_email}</Typography>
              </Stack>
            </TableCell>
            <TableCell>{customer.recipients_id}</TableCell>
            <TableCell>{customer.message}</TableCell>
            <TableCell>{customer.date_and_time}</TableCell>
            <TableCell>{customer.status}</TableCell>
            <TableCell>
              <DeleteOutlineIcon onClick={() => handleOpen(customer.id)} />
            </TableCell>
          </TableRow>
        ))};

      <DeleteDMModal isOpen={isModalOpen} onClose={handleClose} customerId={selectedCustomerId} />
    </>
  );
}
