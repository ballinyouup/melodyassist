/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
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
      <div className="flex flex-col justify-center gap-4 p-4 sm:flex-row">
        <ul className="menu rounded-box menu-normal w-52 bg-base-300 p-2 sm:max-w-sm">
          <li className="menu-title">
            <span>Settings</span>
          </li>
          <li>
            <a>Account</a>
          </li>
          <li className="disabled">
            <a>Billing</a>
          </li>
          <li className="disabled">
            <a>Notifications</a>
          </li>
        </ul>
        <div className="flex w-full flex-col rounded-2xl bg-base-300 p-4 sm:w-3/4 sm:max-w-2xl">
          <table className="table-compact table w-full">
            <tbody>
              <tr>
                <td className="bg-base-300">
                  <div className="flex items-center gap-8 px-4">
                    <img
                      className="h-16 w-16 rounded-full border-2 border-black"
                      src={sessionData.user.image || ""}
                      alt="profile image"
                    />
                    <div className="form-control w-full max-w-xs">
                      <label className="label">
                        <span className="label-text">Change profile image</span>
                      </label>
                      <input
                        type="file"
                        className="file-input-primary file-input file-input-xs w-full max-w-xs cursor-pointer"
                      />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="bg-base-300">
                  <div className="px-6">
                    <div className="flex flex-col gap-4">
                      <span className="text-base">
                        Username: {currentUsername}
                      </span>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm">Change Username</label>
                        <div className="flex gap-4">
                          <input
                            type="text"
                            placeholder="Type Here..."
                            className="input h-8 w-full border-black bg-white p-2 sm:w-64"
                            value={newUsername}
                            onChange={(e) => {
                              setNewUsername(e.target.value);
                            }}
                          />
                          <button
                            className="btn-neutral btn-sm btn h-6 w-fit text-white"
                            onClick={handleChangeUserName}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="bg-base-300">
                  <div className="px-6">
                    <span className="text-base">
                      Email: {sessionData.user.email}
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="bg-base-300">
                  <div className="flex flex-col gap-4 px-6">
                    <label>
                      <i>Warning: Account data cannot be recovered</i>
                    </label>
                    <button
                      className="btn-error btn-sm btn w-fit bg-red-600 text-white hover:bg-red-800"
                      onClick={() => handleDelete()}
                    >
                      Delete Account
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (sessionStatus === "loading") {
    return <>Loading...</>;
  } else void router.push("/");
}
