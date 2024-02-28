import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import {
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { UserService } from "services";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import axios from "axios";

import { Visibility, VisibilityOff } from "@mui/icons-material"; //needed for password toggling

const Page = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registerUser, registerUserInfo] = useRegisterUser();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword); //setting the state of visibility
  };

  const router = useRouter();
  const auth = useAuth();
  const formik = useFormik({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      first_name: Yup.string().max(255).required("First name is required"),
      last_name: Yup.string().max(255).required("Last name is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),

    //  onSubmit:  async (values) => {
    //   await registerUser(values);
    // }

    onSubmit: async (values, helpers) => {
      try {
        console.log("TEST123");
        //useRegisterUser(values);
        //await auth.signUp(values.email, values.first_name, values.last_name, values.password);
        //router.push("/");
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Register | InstaMetrics</title>
      </Head>
      <Box
        sx={{
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
              <Typography variant="h4">Register</Typography>
              <Typography color="text.secondary" variant="body2">
                Already have an account? &nbsp;
                <Link component={NextLink} href="/auth/login" underline="hover" variant="subtitle2">
                  Log in
                </Link>
              </Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.first_name && formik.errors.first_name)}
                  fullWidth
                  helperText={formik.touched.first_name && formik.errors.first_name}
                  label="First name"
                  name="first_name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.first_name}
                />
                <TextField
                  error={!!(formik.touched.last_name && formik.errors.last_name)}
                  fullWidth
                  helperText={formik.touched.last_name && formik.errors.last_name}
                  label="Last name" //label is what the user sees
                  name="last_name" //name is what gets sent to formik for
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.last_name}
                />
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
                  //onChange={formik.handleChange}
                  // type="password"
                  value={formik.values.password}
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => {
                    formik.handleChange(e);
                    // setPassword(e.target.value); --> this is no longer needed, because I included formik, and formik will take care of password field changes
                  }}
                  InputProps={{
                    //inputProps is used to declare somthing that is additionaly used in the input field next to the data itself
                    //endAdornment specifies the position of that icon in the field
                    // edge="end" it is a good practice to have, because this ensures that no matter the number of line of code, the icon will always be located on the left
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

              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                Register
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );

  function useRegisterUser() {
    const [state, setState] = React.useReducer((_, action) => action, {
      isIdle: true,
    });

    const mutate = React.useCallback(async (values) => {
      setState({ isLoading: true });
      try {
        const data = axios
          .post(
            "http://127.0.0.1/Senior-Design-Project-Web-Application/backend/rest/register/",
            values
          )
          .then((res) => res.data);
        setState({ isSuccess: true, data });
        router.push("/");
      } catch (error) {
        setState({ isError: true, error });
      }
    }, []);

    return [mutate, state];
  }
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;

// function registerUser() {
//   console.log("test");
//   const { isLoading, error, data, isFetching } = useQuery({
//     queryKey: ["users", "register"],
//     queryFn: UserService.register,
//   });

//   if (isLoading) return "Loading...";

//   if (error) return "An error has occurred: " + error.message;
// }
