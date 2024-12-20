import React from "react";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { login, register } from "@/hooks/hooks";
import { useRouter } from "next/navigation";

const AuthForm = ({ isLogin, toggleIsLogin }) => {
  const theme = useTheme();
  const router = useRouter();

  const handleLogin = async (data) => {
    const { email, password } = data;
    const res = await login(email, password);
    if (res.ok) {
      router.push("/holdings");
    } else {
      alert(res.message);
    }
  };

  const handleRegister = async (data) => {
    const { email, password, firstName, lastName } = data;
    const res = await register(email, password);
    if (res.ok) {
      router.push("/holdings");
    } else {
      alert(res.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      ...(isLogin
        ? {}
        : {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
          }),
    };
    if (isLogin) {
      await handleLogin(data);
    } else {
      await handleRegister(data);
    }
  };

  return (
    <form
      id={isLogin ? "login" : "register"}
      onSubmit={handleSubmit}
      method="POST"
      className="flex flex-col space-y-4 px-4 py-8 sm:px-16"
      style={{
        backgroundColor: theme.palette.white.main,
      }}
    >
      <div
        style={{
          textAlign: "center",
        }}
      >
        <span
          style={{
            color: theme.palette.primary.main,
            fontFamily: "OurCustomFont-Regular",
            fontWeight: "bold",
            fontSize: "2rem",
            display: "block",
          }}
        >
          {!isLogin ? "SIGN UP" : "LOG IN"}
        </span>
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-xs uppercase"
          style={{
            color: theme.palette.black.main,
          }}
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="user@example.com"
          autoComplete="email"
          required
          style={{
            marginTop: "0.5rem",
            width: "100%",
            appearance: "none",
            borderRadius: "4px",
            border: `1px solid ${theme.palette.secondary.main}`,
            padding: "0.75rem",
            backgroundColor: theme.palette.white.main,
            color: "black", // Set the text color to black
            boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
            // Focus styles
            outline: "none",
            "&:focus": {
              borderColor: theme.palette.secondary.main,
              boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
            },
          }}
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-xs uppercase"
          style={{
            color: theme.palette.black.main,
          }}
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          style={{
            marginTop: "0.5rem",
            width: "100%",
            appearance: "none",
            borderRadius: "4px",
            border: `1px solid ${theme.palette.secondary.main}`,
            padding: "0.75rem",
            backgroundColor: theme.palette.white.main,
            color: "black", // Set the text color to black
            boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
            // Focus styles
            outline: "none",
            "&:focus": {
              borderColor: theme.palette.secondary.main,
              boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
            },
          }}
        />
      </div>
      <p
        className="text-center text-sm"
        style={{
          color: theme.palette.black.main,
        }}
      >
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button type="button" onClick={toggleIsLogin} className="font-semibold">
          {isLogin ? "Sign up" : "Sign in"}
        </button>
        {isLogin ? " for free." : " instead."}
      </p>
      <Button
        type="submit"
        variant="contained"
        style={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.white.main,
          textTransform: "uppercase",
          fontWeight: "bold",
        }}
      >
        {isLogin ? "Log In" : "Register"}
      </Button>
    </form>
  );
};

export default AuthForm;
