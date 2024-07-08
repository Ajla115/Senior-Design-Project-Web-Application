import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteDMModal from "./delete-dm-modal";
import EditDMModal from "./edit-dm-modal"; // Ensure this is the correct import

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
                <TableCell>Email (IG username)</TableCell>
                <TableCell>Recipient</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Other</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <QueryClientProvider client={client}>
                <DMAccountsData accountList={props.accountList} refetch={refetch} />
              </QueryClientProvider>
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
  refetch: PropTypes.func
};

function DMAccountsData(props) {
  const { accountList, refetch } = props; 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [initialValues, setInitialValues] = useState({});

  const handleOpenDeleteModal = (customerId) => {
    setSelectedCustomerId(customerId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleOpenEditModal = (customer) => {
    setSelectedCustomerId(customer.id);
    setInitialValues({
      recipients: customer.recipient,
      message: customer.message,
      date_and_time: customer.dateAndTime,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
      {props.accountList.map((customer) => (
        <TableRow hover key={customer.id}>
          <TableCell>{customer.id}</TableCell>
          <TableCell>
            <Stack alignItems="center" direction="row" spacing={1}>
              <Typography variant="subtitle2">{customer.username}</Typography>
            </Stack>
          </TableCell>
          <TableCell>{customer.recipient}</TableCell>
          <TableCell>{customer.message}</TableCell>
          <TableCell>{customer.dateAndTime}</TableCell>
          <TableCell>
            <EditIcon onClick={() => handleOpenEditModal(customer)} /> 
          </TableCell>
          <TableCell>
            <DeleteOutlineIcon onClick={() => handleOpenDeleteModal(customer.id)} />
          </TableCell>
        </TableRow>
      ))}
      <DeleteDMModal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} customerId={selectedCustomerId} refetch = {refetch}/>
      <EditDMModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} customerId={selectedCustomerId} initialValues={initialValues} refetch = {refetch} />
    </>
  );
}
