import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { useAuthContext } from "src/contexts/auth-context";

const AccountProfile = () => {
  const { user } = useAuthContext();

  return (
    <Box display="flex" justifyContent="center" alignItems="center" my={2}>
      <Typography gutterBottom variant="h4" align="center">
        {user.name}
      </Typography>
    </Box>
  );
};

export default AccountProfile;
