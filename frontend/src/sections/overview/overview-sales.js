import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, Divider, Typography } from "@mui/material";

export const OverviewSales = (props) => {
  const { sx } = props;

  return (
    <Card sx={sx}>
      <CardHeader title="About Insta Metrics" titleTypographyProps={{ variant: "h4" }} />
      <Divider />
      <CardContent>
        <Typography variant="body1" gutterBottom>
          Welcome to Insta Metrics, your all-in-one platform for comprehensive Instagram analytics
          and management. Whether you're a marketer, influencer, or just a social media enthusiast,
          Insta Metrics offers a suite of powerful features to analyze current Instagram market and
          improve your performance.
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Features
        </Typography>
        <Typography variant="body2" component="div">
          <ul>
            <li>
              <strong>Account Management:</strong> Monitor and manage multiple Instagram accounts
              seamlessly. Get insights into followers, posting and more.
            </li>
            <li>
              <strong>Hashtag Analysis:</strong> Discover and analyze hashtags to optimize your
              posts and reach a wider audience. Track hashtag performance and find the best hashtags
              for your content.
            </li>
            <li>
              <strong>DM Campaigns:</strong> Automate and schedule direct messages (DMs) to your
              followers. Manage your DM campaigns efficiently and increase engagement with
              personalized messages.
            </li>
            <li>
              <strong>Customer Service:</strong> Enhance your experience by
              sending emails to platform administrators. 
            </li>
            <li>
              <strong>Personal Profile Insights:</strong> View your personal information, including your password, and change it whenever you want.
            </li>
          </ul>
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
          At Insta Metrics, we are committed to providing you with the tools you need to succeed on
          Instagram. Our platform is designed to be user-friendly and powerful, ensuring that you
          have everything you need at your fingertips.
        </Typography>
        <Typography variant="body1">
          We hope you enjoy using Insta Metrics and find it valuable in achieving your Instagram
          goals. 
        </Typography>
      </CardContent>
    </Card>
  );
};

OverviewSales.propTypes = {
  sx: PropTypes.object,
};
