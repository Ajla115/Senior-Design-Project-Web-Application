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
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { UserService } from "services";
import DeleteAdminModal from "./delete-admin-modal";

export const AdminTable = (props) => {
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
                <AdminAccountsData refetch={refetch} />
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

AdminTable.propTypes = {
  count: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  refetch: PropTypes.func,
};

const AdminAccountsData = ({ refetch }) => {
  const [admins, setAdmins] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const fetchAdmins = async () => {
    try {
      const response = await UserService.getAllAdmins();
      if (response && response.message) {
        setAdmins(response.message);
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [refetch]);

  const handleOpenDeleteModal = (customerId) => {
    setSelectedCustomerId(customerId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    fetchAdmins(); 
  };

  return (
    <>
      {admins && admins.length > 0 ? (
        admins.map((admin) => (
          <TableRow hover key={admin.id}>
            <TableCell>{admin.id}</TableCell>
            <TableCell>
              <Stack alignItems="center" direction="row" spacing={1}>
                <Typography variant="subtitle2">{admin.first_name}</Typography>
              </Stack>
            </TableCell>
            <TableCell>{admin.last_name}</TableCell>
            <TableCell>{admin.email_address}</TableCell>
            <TableCell>
              <DeleteOutlineIcon onClick={() => handleOpenDeleteModal(admin.id)} />
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={5} align="center">
            No admins found.
          </TableCell>
        </TableRow>
      )}
      <DeleteAdminModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        customerId={selectedCustomerId}
        refetch={fetchAdmins} 
      />
    </>
  );
};

AdminAccountsData.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default AdminTable;
