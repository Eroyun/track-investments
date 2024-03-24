"use client";

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

import NavBar from "./navBar";
import AuthForm from "./authForm";

const AuthDialog = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [open, setOpen] = useState(false);

  const toggleIsLogin = () => {
    setIsLogin(!isLogin);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#1A1A1D",
      },
      secondary: {
        main: "#282828",
      },
      white: {
        main: "#FFFFFF",
      },
      blue: "#10BBEC",
      darkBlue: "#011FFF",
      black: {
        main: "#000000",
      },
    },
  });

  return (
    <>
      {" "}
      <ThemeProvider theme={darkTheme}>
        <div
          style={{
            backgroundColor: darkTheme.palette.primary.main,
            minHeight: "100vh",
          }}
        >
          <NavBar handleLogin={handleOpen} />
          <div
            className="login-background-container flex items-center justify-center"
            style={{
              padding: "5rem",
              height: "92vh",
            }}
          >
            <div
              className="flex-1"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginTop: "5rem",
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Segoe UI Emoji"',
                  fontWeight: 700,
                  color: darkTheme.palette.white.main,
                  mb: 2,
                }}
              >
                The best way to Track your investments
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Segoe UI Emoji"',
                  fontWeight: 700,
                  color: darkTheme.palette.white.main,
                  mb: 2,
                }}
              >
                OneStopInvestor brings all the informations together on a single
                platform.
              </Typography>
            </div>

            <div
              className="auth-form-container"
              style={{
                display: "flex",
                flexDirection: "column",
                height: "60vh",
                justifyContent: "center",
                backgroundColor: darkTheme.palette.white.main,
                boxShadow: "5px 3px 5px rgba(0, 0, 0, 0.2)",
                marginTop: "5rem",
                opacity: "0.9",
                borderRadius: "8px",
                padding: "2rem",
                transition: "all 0.3s ease-in-out",
                width: "50%",
                maxWidth: "500px",
                marginLeft: "auto",
                marginRight: "auto",
                boxShadow: "10px 5px 5px rgb(0, 187, 252)",
              }}
            >
              <AuthForm isLogin={isLogin} toggleIsLogin={toggleIsLogin} />
            </div>
          </div>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
              {isLogin ? "Sign In" : "Sign Up"}
              <IconButton
                className="absolute top-2 right-2"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <AuthForm isLogin={isLogin} toggleIsLogin={toggleIsLogin} />
            </DialogContent>
            <DialogActions>
              <Button
                type="submit"
                form={isLogin ? "login" : "register"}
                variant="contained"
                color="primary"
              >
                {isLogin ? "Sign In" : "Sign Up"}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </ThemeProvider>
    </>
  );
};

export default AuthDialog;
