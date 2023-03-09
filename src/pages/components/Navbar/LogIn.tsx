import { signIn, useSession } from "next-auth/react";

function LogIn() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <button
        className="btn rounded-md p-3 text-white"
        onClick={() => void signIn(undefined, { callbackUrl: "/" })}
      >
        Log In
      </button>
    );
  }
  return null;
}

export default LogIn;
