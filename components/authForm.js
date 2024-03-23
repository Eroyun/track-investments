// AuthForm.js
import React from "react";
import { useTheme } from "@mui/material/styles";
import { login, register } from "@/hooks/hooks";
import { useRouter } from "next/navigation";

const AuthForm = ({ isLogin, toggleIsLogin }) => {
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const res = await login(email, password);
    if (res.ok) {
      router.push("/holdings");
    } else {
      alert(res.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const res = await register(email, password);
    if (res.ok) {
      router.push("/holdings");
    } else {
      alert(res.message);
    }
  };

  const theme = useTheme();
  return (
    <form
      method="POST"
      id={isLogin ? "login" : "register"}
      onSubmit={isLogin ? handleLogin : handleRegister}
      className="flex flex-col space-y-4 px-4 py-8 sm:px-16 bg-gray-800 text-white"
      style={{
        backgroundColor: theme.palette.primary.main,
      }}
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
        {isLogin ? "Don't have an account? " : "Already have an account? "}
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
  );
};

export default AuthForm;
