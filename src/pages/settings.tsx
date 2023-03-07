/* eslint-disable @next/next/no-img-element */
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

export default function Settings() {
  const { data: sessionData, status: sessionStatus } = useSession();
  const deleteUser = api.account.deleteAccount.useMutation();
  const router = useRouter();

  function handleDelete() {
    deleteUser.mutate();
    window.location.reload();
  }
  if (sessionStatus === "authenticated") {
    return (
      <>
        <span className="text-2xl font-medium capitalize">
          {sessionData.user.name}
        </span>
        <br />
        <span className="text-lg">{sessionData.user.email}</span>
        <img
          className="h-16 rounded-full border-2 border-black"
          src={sessionData.user.image || ""}
          alt="profile image"
        />
        <button
          className="rounded-md bg-slate-600 p-3 text-white"
          onClick={() => void signOut()}
        >
          Log Out
        </button>
        <br />
        <button
          className="rounded-md bg-red-600 p-3 text-white"
          onClick={() => handleDelete()}
        >
          Delete Account
        </button>
      </>
    );
  }

  if (sessionStatus === "loading") {
    return <>Loading...</>;
  } else void router.push("/");
}
