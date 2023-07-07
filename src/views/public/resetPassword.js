import React, { useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import FormHelperText from "@mui/material/FormHelperText";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import Copyright from "../../components/copyright";

//React router dom
import { useNavigate } from "react-router-dom";

import mainURL from "../../config/environment";
import queryString from "query-string";
import $ from "jquery";

export default function ResetPassword() {
  const navigate = useNavigate();
  //Loading management
  const [isLoading, setLoading] = useState(false);

  //Data management
  const [isPasswordValid, setPasswordValid] = useState(true);
  const [model, setModel] = useState({
    email: "",
    token: "",
    password: "",
    confirmPassword: "",
  });

  const doPasswordsMatch = Boolean(model.password === model.confirmPassword);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    $.ajax({
      method: "POST",
      url: mainURL + "login/reset-password",
      contentType: "application/json",
      data: JSON.stringify(model),
    })
      .done((res) => {
        setLoading(false);
        localStorage.setItem("userInfo", JSON.stringify(res));
        navigate("/login");
      })
      .fail((res) => {
        setLoading(false);
        alert(res.responseText);
      });
  };

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    const queryInfo = queryString.parse(window.location.search);

    switch (name) {
      case "password":
        const isPasswordValid = Boolean(
          value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/i)
        );
        if (isPasswordValid) {
          setPasswordValid(true);
        } else {
          setPasswordValid(false);
        }
        setModel({
          ...model,
          [name]: value,
          token: queryInfo.Token,
          email: queryInfo.email,
        });
        break;

      default:
        setModel({
          ...model,
          [name]: value,
          token: queryInfo.Token,
          email: queryInfo.email,
        });
        break;
    }
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
              error={!isPasswordValid}
              margin="dense"
              required
              fullWidth
              name="password"
              label="Nueva contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />
            {!isPasswordValid ? (
              <FormHelperText>
                {
                  "La contraseña debe contener al menos una letra mayúscula, una minúscula y un número"
                }
              </FormHelperText>
            ) : null}
            <TextField
              error={!doPasswordsMatch}
              margin="dense"
              required
              fullWidth
              name="confirmPassword"
              label="Confirme su contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />
            {!doPasswordsMatch ? (
              <FormHelperText>{"Las contraseñas no coinciden"}</FormHelperText>
            ) : null}
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Reestablecer contraseña
              </Button>
            )}
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
