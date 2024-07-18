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
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { UserService } from "services";
import ResolveConfirmationModal from "./resolve-confirmation-modal";

const CustomerServiceTicketsTable = ({ refetch }) => {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const fetchTickets = async () => {
    try {
      const response = await UserService.getCustomerServiceTickets();
      if (response && response.message) {
        setTickets(response.message);
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [refetch]);

  const handleOpenModal = (ticketId) => {
    setSelectedTicketId(ticketId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Sender Name</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow hover key={ticket.id}>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{ticket.description}</TableCell>
                  <TableCell>{ticket.sender_name}</TableCell>
                  <TableCell>
                    {ticket.status === "Resolved" ? (
                      "Resolved"
                    ) : (
                      <IconButton color="success" onClick={() => handleOpenModal(ticket.id)}>
                        <CheckCircleIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>

      {isModalOpen && (
        <ResolveConfirmationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          ticketId={selectedTicketId}
          refetch={fetchTickets}
        />
      )}
    </>
  );
};

CustomerServiceTicketsTable.propTypes = {
  refetch: PropTypes.func,
};

export default CustomerServiceTicketsTable;
