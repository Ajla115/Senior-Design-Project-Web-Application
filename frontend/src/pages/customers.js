import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Divider, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersTable } from "src/sections/customer/customers-table";
import OpenPromptToAddNewAccount from "src/sections/customer/add-ig-account-prompt";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { InstagramService } from "services";

const now = new Date();



const Page = () => {
  const [page, setPage] = useState(0);
  const [show, setShow] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [accountList, setAccountList] = useState(undefined);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const { isLoading, error, data, isFetching, refetch } = useQuery({
    queryKey: ["instagram-data"],
    queryFn: InstagramService.getAccountData,
  });

  useEffect(() => {
    if (data) {
      setAccountList(data);
    }
  }, [data]);



  return (
    <>
      <Head>
        <title>Instagram Accounts | InstaMetrics</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Instagram Accounts</Typography>
               
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  onClick={() => {
                    setShow(true);
                  }}
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            {show && <OpenPromptToAddNewAccount closeButton={setShow} refetchAccounts={refetch} />}
            <Divider />
            {/* <CustomersSearch /> */}
            {accountList && (
              <CustomersTable
                count={accountList.length}
                //items={customers}
                //onDeselectAll={customersSelection.handleDeselectAll}
                //onDeselectOne={customersSelection.handleDeselectOne}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                //onSelectAll={customersSelection.handleSelectAll}
                //onSelectOne={customersSelection.handleSelectOne}
                page={page}
                rowsPerPage={rowsPerPage}
                //selected={customersSelection.selected}
                accountList={accountList}
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
