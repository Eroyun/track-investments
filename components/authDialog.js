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
import CloseIcon from "@mui/icons-material/Close";

const AuthDialog = ({ register, login }) => {
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

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="mb-4 text-center text-blue-300">
          In order to add or see your investments, you need to login.
        </p>
        <Button variant="outlined" onClick={handleOpen}>
          Login
        </Button>
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
          <form
            id={isLogin ? "login" : "register"}
            onSubmit={isLogin ? login : register}
            className="flex flex-col space-y-4 px-4 py-8 sm:px-16 bg-gray-800 text-white"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-xs text-gray-300 uppercase"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
                autoComplete="email"
                required
                className="mt-1 block w-full appearance-none rounded-md border border-gray-600 px-3 py-2 placeholder-gray-500 shadow-sm focus:border-white focus:outline-none focus:ring-white sm:text-sm bg-gray-700 text-white"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-xs text-gray-300 uppercase"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full appearance-none rounded-md border border-gray-600 px-3 py-2 placeholder-gray-500 shadow-sm focus:border-white focus:outline-none focus:ring-white sm:text-sm bg-gray-700 text-white"
              />
            </div>
            <p className="text-center text-sm text-gray-300">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={toggleIsLogin}
                className="font-semibold text-white"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
              {isLogin ? " for free." : " instead."}
            </p>
          </form>
        </DialogContent>
        <DialogActions>
          <Button type="submit" form={isLogin ? "login" : "register"}>
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AuthDialog;
