import { SignIn } from "@clerk/nextjs";
 
export default function Page() {
  return <><SignIn path="/sign-in"/><h3>Try as guest email: guest@example.com pass: 12354</h3></>;
}