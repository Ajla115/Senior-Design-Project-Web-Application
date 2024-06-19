import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { useMutation, QueryClientProvider, QueryClient } from "@tanstack/react-query";
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
  const [backendResult, setBackendResult] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    onSubmit: async (values, helpers) => {
      try {
        await mutation.mutateAsync();
        // const result = await UserService.register(formik.values.first_name,
        //   formik.values.last_name,
        //   formik.values.email,
        //   formik.values.password);
        // setBackendResult(result);
        //console.log(JSON.stringify(backendResult));
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

  const mutation = useMutation({
    mutationFn: async () => {
      const userResponse = await UserService.register(
        formik.values.first_name,
        formik.values.last_name,
        formik.values.phone,
        formik.values.email,
        formik.values.password
      );
      setBackendResult(userResponse);
      //closeButton(false); //to close the modal
    },
    onError: (error) => {
      console.error(" Error adding a new user:", error);
    },
  });

  useEffect(() => {
    if (backendResult !== "") {
      //console.log(backendResult);
      if (backendResult.status == 200) {
        
        router.push("/auth/login");
      } else if (backendResult.status == 500) {
        setErrorMessage(backendResult.message);
      }
    }
  }, [backendResult, router]);

  // const handleRegistration = async () => {
  //   console.log("Registering");
  //   try {
  //     await mutation.mutateAsync();
  //   } catch (error) {
  //     console.error("Error adding a new user:", error);
  //   }
  // };

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
                  error={!!(formik.touched.phone && formik.errors.phone)}
                  fullWidth
                  helperText={formik.touched.phone && formik.errors.phone}
                  label="Phone" //label is what the user sees
                  name="phone" //name is what gets sent to formik for
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.phone}
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
              {errorMessage && <p style={{ color: "red" }}>Error: {errorMessage}</p>}
              <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                Register
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
