import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Divider, Stack, SvgIcon, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { HashtagsTable } from 'src/sections/hashtags/hashtags-table';
import OpenPromptToAddNewHashtag from 'src/sections/hashtags/add-hashtag-prompt';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { InstagramService } from 'services';

const now = new Date();

const Page = () => {
  const [page, setPage] = useState(0);
  const [show, setShow] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [hashtagList, setHashtagList] = useState([]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const { isLoading, error, data, isFetching, refetch } = useQuery({
    queryKey: ['hashtag-data'],
    queryFn: InstagramService.getHashtagData,
  });

  useEffect(() => {
    if (data) {
      setHashtagList(data.message);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>Instagram Hashtags | InstaMetrics</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Instagram Hashtags</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={<SvgIcon fontSize="small"><PlusIcon /></SvgIcon>}
                  onClick={() => setShow(true)}
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            {show && <OpenPromptToAddNewHashtag closeButton={setShow} refetchHashtags={refetch} />}
            <Divider />
            {hashtagList && (
              <HashtagsTable
                count={hashtagList.length}
                items={hashtagList}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                refetch={refetch}
              />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
