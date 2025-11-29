'use client';

import { withGuest } from "@/(middleware)";
import Login from "./login";

function LoginPage() {

  return (
    <Login />
  );
}

export default withGuest(LoginPage);