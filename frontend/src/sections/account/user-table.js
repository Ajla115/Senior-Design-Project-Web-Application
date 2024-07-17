import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { UserService } from "services";
import DeleteUserModal from "./delete-user-modal";

export const UserTable = (props) => {
  const {
    count = 0,
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    refetch,
  } = props;

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
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Other</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <QueryClientProvider client={client}>
                <UserAccountsData refetch={refetch} />
              </QueryClientProvider>
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};

UserTable.propTypes = {
  count: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  refetch: PropTypes.func,
};

const UserAccountsData = ({ refetch }) => {
  const [users, setUsers] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await UserService.getActiveUsers();
      if (response && response.message) {
        setUsers(response.message);
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refetch]);

  const handleOpenDeleteModal = (customerId) => {
    setSelectedCustomerId(customerId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    fetchUsers(); 
  };

  return (
    <>
      {users && users.length > 0 ? (
        users.map((user) => (
          <TableRow hover key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell>
              <Stack alignItems="center" direction="row" spacing={1}>
                <Typography variant="subtitle2">{user.first_name}</Typography>
              </Stack>
            </TableCell>
            <TableCell>{user.last_name}</TableCell>
            <TableCell>{user.email_address}</TableCell>
            <TableCell>
              <DeleteOutlineIcon onClick={() => handleOpenDeleteModal(user.id)} />
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={5} align="center">
            No users found.
          </TableCell>
        </TableRow>
      )}
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        customerId={selectedCustomerId}
        refetch={fetchUsers} 
      />
    </>
  );
};

UserAccountsData.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default UserTable;
