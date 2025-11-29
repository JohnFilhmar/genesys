'use client';

import { withGuest } from "@/(middleware)";
import Signup from "./signup";

function SignupPage() {

  return (
    <Signup />
  )
  
}

export default withGuest(SignupPage);