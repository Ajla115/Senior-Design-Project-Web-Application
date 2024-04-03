import PropTypes from "prop-types";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
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
  Button,
  SvgIcon,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import { InstagramService, UserService } from "services";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteModal from "./delete-instagram-hashtag";

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
                <TableCell>Name </TableCell>
                <TableCell>Number of Accounts</TableCell>
                <TableCell>Show Accounts</TableCell>
                <TableCell>Other</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <QueryClientProvider client={client}>
                <InstagramHashtagsData />
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
};

function InstagramHashtagsData() {
  //const posts = useSampleData();
  // console.log(posts);

  //This is all for deleting a modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedHashtagId, setSelectedHashtagId] = React.useState(null);
  const [accountsPerHashtag, setAccountsPerHashtag] = React.useState({});
  
  //I need this to open table with all accounts for one hashtag
  const [show, setShow] = useState(false);

  const handleOpen = (hashtagId) => {
    setSelectedHashtagId(hashtagId);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  //fetching data from database
  //fetching data from database
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ["instagram-data"],
    queryFn: InstagramService.getHashtagData,
  });

  useEffect(() => {
    if (data?.message) {
      // Extracting hashtag IDs
      const hashtagIds = data.message.map((hashtag) => hashtag.id);
      // Fetch account counts for all hashtags in one go
      for (let i = 0; i < hashtagIds.length; i++) {
        try {
          const data = InstagramService.getAccountsPerHashtag(hashtagIds[i]).then(
            setAccountsPerHashtag
          );
          //console.log(`Data for hashtag ${hashtags[i]}: `, data);
        } catch (error) {
          console.error(`Error fetching data for hashtag ${hashtags[i]}: `, error);
        }
      }
      //InstagramService.getAccountsPerHashtag(hashtagIds).then(setAccountsPerHashtag);
    }
  }, [data]);

  //const { isLoading, error, data, isFetching } = useSampleData();

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      {data.message.map((hashtag) => {
        //izvucem gotov podatak
        const numberOfAccounts = InstagramService.getAccountsPerHashtag(hashtag.id);
        //{data.message.map((hashtag) => {

        return (
          <TableRow hover key={hashtag.id}>
            <TableCell>{hashtag.id}</TableCell>

            <TableCell>
              <Stack alignItems="center" direction="row" spacing={1}>
                <Typography variant="subtitle2">{hashtag.hashtag_name}</Typography>
              </Stack>
            </TableCell>
            <TableCell> {accountsPerHashtag[hashtag.id] || "Loading..."}</TableCell>
            <TableCell>
              <Button
                onClick={() => {
                  setShow(true);
                }}
                variant="text"
              >
                See accounts
              </Button>
            </TableCell>

            {show && <ShowAccountsData closeButton={setShow} />}

            <TableCell>
              <DeleteOutlineIcon onClick={() => handleOpen(hashtag.id)} />
            </TableCell>
          </TableRow>
        );
      })}

      <DeleteModal isOpen={isModalOpen} onClose={handleClose} hashtagId={selectedHashtagId} />
    </>
  );
}
