import React, { useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import Copyright from "../../components/copyright";

//React router dom
import { useNavigate, Link } from "react-router-dom";

import mainURL from "../../config/environment";
import $ from "jquery";

export default function Login() {
  const navigate = useNavigate();
  //Load management
  const [isLoading, setLoading] = useState(false);

  //Data management
  const [model, setModel] = useState({
    email: "",
    password: "",
  });

  //Notification management
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState({
    severity: "",
    message: "",
  });

  const handleShowNotification = (severity, message) => {
    setNotificationMessage({ severity: severity, message: message });
    setShowNotification(true);
    setTimeout(function () {
      setShowNotification(false);
    }, 3000);
  };

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setModel({
      ...model,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    $.ajax({
      method: "POST",
      url: mainURL + "login/authenticate-user",
      contentType: "application/json",
      data: JSON.stringify(model),
    })
      .done((res) => {
        setLoading(false);
        localStorage.setItem("userInfo", JSON.stringify(res));
        navigate("/");
      })
      .fail((res) => {
        setLoading(false);
        if (res.status === 401) {
          handleShowNotification("warning", "Contraseña o email inválidos");
        } else if (res.status === 500) {
          handleShowNotification("warning", "Algo anda mal");
        }
      });
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(assets/bg-black.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <img src="assets/logo.png" width={"80%"} alt="logo" />

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "80%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />

            {isLoading ? (
              <Grid container justifyContent={"center"}>
                <CircularProgress />
              </Grid>
            ) : showNotification ? (
              <Alert variant="outlined" severity={notificationMessage.severity}>
                {notificationMessage.message}
              </Alert>
            ) : (
              <Grid container justifyContent={"center"} sx={{ mt: 3, mb: 2 }}>
                <Button type="submit" fullWidth variant="contained">
                  Iniciar sesión
                </Button>
              </Grid>
            )}
            {!isLoading ? (
              <Grid container justifyContent={"center"}>
                <Grid item>
                  <Link to="/forgot-password" variant="body2">
                    ¿Olvidó su contraseña?
                  </Link>
                </Grid>
              </Grid>
            ) : null}
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
