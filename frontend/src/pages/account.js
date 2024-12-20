import Head from "next/head";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, Divider } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import AccountProfile from "src/sections/account/account-profile";
import { AccountProfileDetails } from "src/sections/account/account-profile-details";

const Page = () => (
  <>
    <Head>
      <title>Account | InstaMetrics</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">Personal Information</Typography>
          </div>
          <Divider sx={{ borderBottomWidth: 2, borderColor: "grey" }} />
          <div>
            <AccountProfile />
            <Grid container justifyContent="center">
              <Grid item xs={12}>
                <AccountProfileDetails />
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
