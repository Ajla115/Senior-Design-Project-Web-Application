import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { DMService } from "services";


const SentDMTable = ({ count, onPageChange, onRowsPerPageChange, page, rowsPerPage }) => {
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


  const { isLoading, error, data, isFetching, refetch } = useQuery({
    queryKey: ["sent-dm-data"],
    queryFn: DMService.getSentDMS, 
  });

  const [sentDMList, setSentDMList] = useState([]);

  useEffect(() => {
    if (data) {
      setSentDMList(data);
    }
  }, [data]);

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
              </TableRow>
            </TableHead>
            <TableBody>
              <QueryClientProvider client={client}>
                {sentDMList.map((dm) => (
                  <TableRow hover key={dm.id}>
                    <TableCell>{dm.id}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{dm.username}</Typography>
                    </TableCell>
                    <TableCell>{dm.recipient}</TableCell>
                    <TableCell>{dm.message}</TableCell>
                    <TableCell>{dm.dateAndTime}</TableCell>
                  </TableRow>
                ))}
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

SentDMTable.propTypes = {
  count: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};

export default SentDMTable;
