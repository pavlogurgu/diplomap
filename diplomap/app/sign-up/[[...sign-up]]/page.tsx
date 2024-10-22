import { SignUp } from "@clerk/nextjs";
 
export default function Page() {
  return <><SignUp path="/sign-up" /><h3>Try as guest email: guest@example.com pass: 12354</h3></>;
}