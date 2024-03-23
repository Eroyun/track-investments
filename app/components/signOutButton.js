import { signOut } from "../api/auth/auth";

const SignOutButton = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit">Sign out</button>
    </form>
  );
};

export default SignOutButton;
