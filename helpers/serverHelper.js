"use server";

import { createUser, getUser } from "@/db/users";
import { signIn } from "../auth";

export const register = async (formData) => {
  let email = formData.get("email");
  let password = formData.get("password");
  let user = await getUser(email);
  if (user.length > 0) {
    return "User already exists"; // TODO: Handle errors with useFormStatus
  } else {
    await createUser(email, password);
    await signIn("credentials", {
      redirectTo: "/holdings",
      email: email,
      password: password,
    });
  }
};

export const login = async (formData) => {
  await signIn("credentials", {
    redirectTo: "/holdings",
    email: formData.get("email"),
    password: formData.get("password"),
  });
};
