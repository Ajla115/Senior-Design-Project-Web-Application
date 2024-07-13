import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Card,
  CardActions,
  CardHeader,
  Box,
  TextField,
  InputAdornment,
  IconButton
} from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from "formik";
import * as Yup from "yup";
import { UserService } from "services";

export const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleRepeatPassword = () => {
    setShowRepeatPassword(!showRepeatPassword);
  };

  const router = useRouter();
  const [activationToken, setActivationToken] = useState('');

  useEffect(() => {
    if (router.isReady) {
      const { activation_token } = router.query;
      if (activation_token) {
        setActivationToken(activation_token);
      }
    }
  }, [router.isReady, router.query]);

  const formik = useFormik({
    initialValues: {
      new_password: '',
      repeat_password: ''
    },
    validationSchema: Yup.object({
      new_password: Yup.string()
        .required('Password field cannot be empty'),
      repeat_password: Yup.string()
        .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
        .required('Repeat password field cannot be empty')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const response = await UserService.resetPassword(values.new_password, values.repeat_password, activationToken);
        alert(response.message);
        router.push("/auth/login/");
      } catch (error) {
        console.log("Error: ", error);
        alert(`Error: ${error.message || "Unknown error occurred"}`);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader
          title="Enter your new password"
          subheader="Once you create a new password, you will be able to log in once again."
        />
        <CardActions>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              mt: 2,
            }}
          >
            <TextField
              error={!!(formik.touched.new_password && formik.errors.new_password)}
              fullWidth
              helperText={formik.touched.new_password && formik.errors.new_password}
              label="New Password"
              name="new_password"
              onBlur={formik.handleBlur}
              value={formik.values.new_password}
              type={showPassword ? "text" : "password"}
              onChange={formik.handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton color="primary" onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ width: '95%', maxWidth: '8000px', mb: 2 }}
            />
            <TextField
              error={!!(formik.touched.repeat_password && formik.errors.repeat_password)}
              fullWidth
              helperText={formik.touched.repeat_password && formik.errors.repeat_password}
              label="Repeat New Password"
              name="repeat_password"
              onBlur={formik.handleBlur}
              value={formik.values.repeat_password}
              type={showRepeatPassword ? "text" : "password"}
              onChange={formik.handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton color="primary" onClick={handleToggleRepeatPassword} edge="end">
                      {showRepeatPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ width: '95%', maxWidth: '8000px', mb: 2 }}
            />
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={formik.isSubmitting}
              sx={{
                fontSize: "1rem",
                padding: "0.5rem 1.5rem",
                backgroundColor: "darkblue",
                mt: 2,
                ml: 120,
                mb: 2,
                width: "50%",
                maxWidth: "120px",
              }}
            >
              Confirm
            </Button>
          </Box>
        </CardActions>
      </Card>
    </form>
  );
};
