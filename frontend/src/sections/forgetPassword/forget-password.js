import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Card, CardActions, CardHeader, Box, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { UserService } from "services";

export const ForgetPassword = () => {
  
  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address format')
        .required('Email field cannot be empty')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const response = await UserService.forgetPassword(values.email);
        alert(response.message);
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
          title="Enter your email to change password"
          subheader="Once you reset your password, you will be able to log in once again."
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
              label="Email Address"
              name="email"
              type="email"
              variant="outlined"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{ width: "95%", maxWidth: "7000px" }}
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
              Send
            </Button>
          </Box>
        </CardActions>
      </Card>
    </form>
  );
};
