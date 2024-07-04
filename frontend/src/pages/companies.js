import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import WriteDMForm from "src/sections/companies/add-a-new-dm";
import { DMTable } from "src/sections/companies/dm-table";
import { DMService } from "services";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

const Page = () => {
  const [showDMPrompt, setDMPrompt] = useState(false); //dm prompt is not seen at the beginning
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
    queryKey: ["dm-data"],
    queryFn: DMService.getAllDMS,
  });

  useEffect(() => {
    if (data) {
      setAccountList(data);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>Automatic DMs | InstaMetrics</title>
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
                <Typography variant="h4">Automated Direct Messages</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  onClick={() => {
                    setDMPrompt(true);
                  }} //changing state of the DMPrompt
                  variant="contained"
                >
                  Add
                </Button>
                <Divider sx={{ borderBottomWidth: 2, borderColor: "grey" }} />
              </div>
            </Stack>
            {showDMPrompt && <WriteDMForm closeButton={setDMPrompt} />}
            {accountList && (
              <DMTable
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

            {/* <Grid
            container
            spacing={3}
          >
            {companies.map((company) => (
              <Grid
                xs={12}
                md={6}
                lg={4}
                key={company.id}
              >
                <CompanyCard company={company} />
              </Grid> 
            ))};
            </Grid> */}

            {/* // <Box
        //     sx={{
        //       display: 'flex',
        //       justifyContent: 'center'
        //     }}
        //   >
        //     <Pagination
        //       count={3}
        //       size="small"
        //     />
        //   </Box> */}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
