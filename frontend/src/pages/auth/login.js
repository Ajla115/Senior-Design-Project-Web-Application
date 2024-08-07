import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Box,
  Button,
  FormHelperText,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Divider
} from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { Visibility, VisibilityOff } from "@mui/icons-material"; //needed for password toggling
import { UserService } from "services";
import { useMutation } from "@tanstack/react-query";
import { AuthProvider, useAuthContext } from "src/contexts/auth-context";

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [backendResult, setBackendResult] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { signIn } = useAuthContext();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword); //setting the state of visibility
  };

  const router = useRouter();
  const auth = useAuth();
  const [method, setMethod] = useState("email");
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        //router.push("/");
        await mutation.mutateAsync();
        //setBackendResult(result);
        // //console.log(JSON.stringify(backendResult));
        // if (result.status === 200) {
        //   router.push("/");
        // } else {
        //   //console.log(backendResult.message);
        //   helpers.setErrors({ submit: result.message });
        // }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message || "An unexpected error happened." });
        helpers.setSubmitting(false);
        helpers.setSubmitting(false);
      }
    },
  });

  const handleMethodChange = useCallback((event, value) => {
    setMethod(value);
  }, []);

  const mutation = useMutation({
    mutationFn: async () => {
      const userResponse = await UserService.login(formik.values.email, formik.values.password);
      setBackendResult(userResponse);
    },
    onError: (error) => {
      //console.error("Error logging: ", error);
      helpers.setStatus({ success: false });
      helpers.setErrors({ submit: error.message });
      helpers.setSubmitting(false);
    },
  });

  useEffect(() => {
    if (backendResult !== "") {
      if (backendResult.status === 200) {
        signIn(backendResult);
        //router.push("/");
      }

      if (backendResult.status === 500) {
        //console.log( backendResult.message) ;
        setErrorMessage(backendResult.message);
      }
    }
  }, [backendResult, router]);

  return (
    <>
      <Head>
        <title>Login | InstaMetrics</title>
      </Head>
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Login</Typography>
              <Typography color="text.secondary" variant="body2">
                Don&apos;t have an account? &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  Register
                </Link>
              </Typography>
            </Stack>
            <Tabs onChange={handleMethodChange} sx={{ mb: 3 }} value={method}>
              <Tab label="Email" value="email" />

              {/* <Tab
                label="Phone Number"
                value="phoneNumber"
              /> */}
            </Tabs>
            {method === "email" && (
              <form noValidate onSubmit={formik.handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label="Email Address"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="email"
                    value={formik.values.email}
                  />
                  <TextField
                    error={!!(formik.touched.password && formik.errors.password)}
                    fullWidth
                    helperText={formik.touched.password && formik.errors.password}
                    label="Password"
                    name="password"
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton color="primary" onClick={handleTogglePassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
                <Box>
                <Divider sx={{ borderBottomWidth: 15, borderColor: 'white' }} />
                </Box>
                <Typography color="text.secondary" variant="body2">
                Forgot your password? &nbsp;
                <Link
                  component={NextLink}
                  href="/forgetPassword"
                  underline="hover"
                  variant="subtitle2"
                >
                  Change password
                </Link>
              </Typography>
                {/* <FormHelperText sx={{ mt: 1 }}>Optionally you can skip.</FormHelperText> */}
                {formik.errors.submit && (
                  <Typography color="error" sx={{ mt: 3 }} variant="body2">
                    {formik.errors.submit}
                  </Typography>
                )}
                {errorMessage && <p style={{ color: "red" }}>Error: {errorMessage}</p>}
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                  // onClick={handleLogin}
                  disabled={mutation.isLoading}
                >
                  Login
                </Button>
              </form>
            )}
            {/* {method === 'phoneNumber' && (
              <div>
                <Typography
                  sx={{ mb: 1 }}
                  variant="h6"
                >
                  Not available in the demo
                </Typography>
                <Typography color="text.secondary">
                  To prevent unnecessary costs we disabled this feature in the demo.
                </Typography>
              </div>
            )} */}
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
