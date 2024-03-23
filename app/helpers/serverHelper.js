"use server";

import { createUser, getUser } from "../api/auth/db";
import { signIn } from "../api/auth/auth";

export const register = async (formData) => {
  let email = formData.get("email");
  let password = formData.get("password");
  let user = await getUser(email);
  if (user.length > 0) {
    return "User already exists"; // TODO: Handle errors with useFormStatus
  } else {
    await createUser(email, password);
    await signIn("credentials", {
      redirectTo: "/",
      email: email,
      password: password,
    });
    console.log("test");
  }
};

export const login = async (formData) => {
  console.log("test");
  await signIn("credentials", {
    redirectTo: "/",
    email: formData.get("email"),
    password: formData.get("password"),
  });
};
