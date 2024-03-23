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
    },
  });

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <div
          style={{
            backgroundColor: darkTheme.palette.primary.main,
            minHeight: "100vh",
          }}
        >
          <NavBar handleLogin={handleOpen} />
          <div
            className="flex items-center justify-center"
            style={{ padding: "2rem" }}
          >
            <div className="flex-1">
              <Typography
                variant="h1"
                sx={{
                  fontFamily: '"Segoe UI Emoji"',
                  fontWeight: 700,
                  color: darkTheme.palette.blue,
                  mb: 2,
                }}
              >
                Welcome Back!
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
                To see or add new investments please login with your personal
                info
              </Typography>
            </div>

            <div
              className="flex-1 auth-form-container"
              style={{ minHeight: "100vh", margin: "auto" }}
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
