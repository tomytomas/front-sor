import React, { useState, useEffect } from "react";
import { Box, Checkbox, CssBaseline, FormControlLabel, Paper, createTheme, ThemeProvider, Container, Typography } from "@mui/material";
import Grid2 from "@mui/material/Grid";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { useFormik } from "formik";
import { useAuthContext } from "../../Contexts/authContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import './SignIn.css';
import { Lock, MailLock} from "@mui/icons-material";





const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#64b5f6",
    },
    background: {
      default: "#121a24",
      paper: "#1f2b37",
    },
  },
});
export default function SignIn() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/dashboardview", { replace: true });
    }
  }, [navigate]);

  const { signIn } = useAuthContext();

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const formik = useFormik({
    initialValues: {
      mail: "",
      password: "",
    },
    onSubmit: (values) => {
      const { mail, password } = values;
      const endpoint = process.env.REACT_APP_API_URL_LOGIN;
   



      axios
        .post(endpoint, { mail, password })
        .then((response) => {
          if (response.data.token !== undefined) {
       
           
            sessionStorage.setItem("token", response.data.token);
            sessionStorage.setItem("user", "true");
            sessionStorage.setItem("user_mail", mail);
            sessionStorage.setItem("userName", response.data.user.name);
            sessionStorage.setItem("user_id", response.data.user._id);

            Swal.fire({
              text: "Usuario logueado correctamente",
              icon: "success",
              confirmButtonText: "Ok",
            }).then((okay) => {
              if (okay) {
                signIn(response.data.token);
                navigate("/dashboardview", { replace: true });
              }
            });
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            Swal.fire({
              icon: "info",
              title: "Verify your email",
              text: "You need to verify your email before logging in.",
              confirmButtonText: "Go to verification",
            }).then(() => {
              navigate("/verify", { replace: true });
            });
          } else {
            Swal.fire({
              text: "Usuario o contraseña incorrectos",
              icon: "error",
              confirmButtonText: "Ok",
            });
          }
        });
    },
  });


  return (
    <ThemeProvider theme={theme}>
      <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#121212", // fondo oscuro
      }}
    >
      <Typography variant="h4" fontWeight="bold" sx={{ color: "#64b5f6" }}>
          Secure Message Hub  
        </Typography>
      <MailLock sx={{ fontSize: 80, color: "#00bcd4", ml: "15px"  }} />
      
      
    </Box>
      <Grid2
        container
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          minHeight: "100vh",
        }}
      >
        <CssBaseline />
        <Container sx={{ mb: 6, mt: 20 }}>
          <Paper
            sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: "#121a24",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
           maxWidth: "480px",
            width: "100%",
            margin: "auto",
            }}
          >
            
            <Lock sx={{ fontSize: 80, color: "#00bcd4" }} />
            <form onSubmit={formik.handleSubmit} className="w-100 m-0 p-0">
              <div className="input-group">
                <input
                  className="input-custom"
                  required
                  id="mail"
                  name="mail"
                  autoComplete="email"
                  value={formik.values.mail}
                  onChange={formik.handleChange}
                />
                <label className="input-label" htmlFor="email">
                  Email Address
                </label>
              </div>
              <div className="input-group">
                <input
                  className="input-custom"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  required
                />
                <label className="input-label" htmlFor="password">
                  Password
                </label>
               
              </div>
              <div className="d-flex justify-content-between align-items-center mt-1">
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                  sx={{ fontSize: 12 }}
                />
                <Link to="/restore-password" className="redirect-text">
                  Forgot password?
                </Link>
              </div>
              <button type="submit" className="form-btn w-100 my-3">
                Sign In <ArrowForwardIcon />
              </button>
            </form>
          </Paper>
        </Container>
      </Grid2>
    </ThemeProvider>
  );
}
