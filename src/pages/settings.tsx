/* eslint-disable @next/next/no-img-element */
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

export default function Settings() {
  const getUsername = api.account.getUserName.useQuery();
  const username = getUsername.data?.userName;
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
    if (typeof username === "string") {
      setCurrentUsername(username);
    }
  }, [username]);

  if (sessionStatus === "authenticated") {
    return (
      <div className="flex w-full flex-col p-4 sm:w-2/3">
        <span className="text-lg capitalize">Username: {currentUsername}</span>
        <span className="text-lg">Email: {sessionData.user.email}</span>
        <img
          className="h-16 w-16 rounded-full border-2 border-black"
          src={sessionData.user.image || ""}
          alt="profile image"
        />
        <button
          className="btn-sm btn w-fit text-white"
          onClick={() => void signOut()}
        >
          Log Out
        </button>
        <button
          className="btn-sm btn-error bg-red-600 btn w-fit text-white hover:bg-red-800"
          onClick={() => handleDelete()}
        >
          Delete Account
        </button>
        <div className="flex flex-row items-center gap-4">
          <label>Change Username</label>
          <input
            type="text"
            placeholder="Type Here..."
            className="input h-8 w-full border-black bg-slate-200 sm:w-60 p-2"
            value={newUsername}
            onChange={(e) => {
              setNewUsername(e.target.value);
            }}
          />
        </div>
        <button
          className="btn-sm btn w-fit text-white"
          onClick={handleChangeUserName}
        >
          Submit
        </button>
      </div>
    );
  }

  if (sessionStatus === "loading") {
    return <>Loading...</>;
  } else void router.push("/");
}
