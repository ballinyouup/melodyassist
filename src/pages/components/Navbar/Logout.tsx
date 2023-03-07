import { signOut, useSession } from "next-auth/react";

function Logout() {
  const { data: session } = useSession();
  if (session) {
    return (
      <button
        className="btn rounded-md p-3 text-white"
        onClick={() => void signOut()}
      >
        Log Out
      </button>
    );
  }
  return null;
}

export default Logout;
