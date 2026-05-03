import { ReactNode } from "react";

// The registration flow shares state via sessionStorage (client-side only).
// Each step reads/writes a "registration_state" key with { dob, consentAt }.

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
