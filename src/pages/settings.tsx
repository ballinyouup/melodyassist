/* eslint-disable @next/next/no-img-element */
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

export default function Settings() {
  const getUsername = api.account.getUserName.useQuery();
  const [currentUsername, setCurrentUsername] = useState<string>("");

  const { data: sessionData, status: sessionStatus } = useSession();
  const deleteUser = api.account.deleteAccount.useMutation();
  const router = useRouter();

  function handleDelete() {
    deleteUser.mutate();
    window.location.reload();
  }

  const changeUserName = api.account.updateUserName.useMutation();
  const [newUsername, setNewUsername] = useState<string>("");
  const handleChangeUserName = () => {
    changeUserName.mutate(newUsername);
    setCurrentUsername(newUsername);
  };

  useEffect(() => {
    if (typeof getUsername.data?.userName === "string") {
      setCurrentUsername(getUsername.data?.userName);
    }
  }, [getUsername.data?.userName]);

  if (sessionStatus === "authenticated") {
    return (
      <>
        <span className="text-lg capitalize">
          Username: {currentUsername}
        </span>
        <br />
        <span className="text-lg">Email: {sessionData.user.email}</span>
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
        <input
          type="text"
          placeholder="Type here"
          className="input m-4 w-full max-w-xs border-black bg-slate-200"
          value={newUsername}
          onChange={(e) => {
            setNewUsername(e.target.value);
          }}
        />
        <button className="btn" onClick={handleChangeUserName}>
          Submit
        </button>
      </>
    );
  }

  if (sessionStatus === "loading") {
    return <>Loading...</>;
  } else void router.push("/");
}
