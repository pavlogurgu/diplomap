// import CreateTrip from "@/components/ui/CreateTrip/page";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs";

export default async function Home() {
  // const { userId } = auth();
 
  // if (userId) {
  //   // Query DB for user specific information or display assets only to signed in users 
  // }
 
  // // Get the Backend API User object when you need access to the user's information
  // const user = await currentUser()
  
  // console.log('user', {user})
  return (
    <div className="h-screen">



      <h1>Home Page</h1>
      {/* <CreateTrip/> */}
    </div>
  )
}