/* eslint-disable @next/next/no-img-element */
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import Layout from "./Layout";
const Settings: React.FC = () => {
  //const getUsername = api.account.getUserName.useQuery();
  // const username = getUsername.data?.userName;
  //const [currentUsername, setCurrentUsername] = useState<string>("");
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      void signIn(undefined, { redirect: true, callbackUrl: '/'  })
      toast.error("Please sign in");
    },
  });
  const sessionClient = api.useContext();
  const getUser = api.account.getUserData.useQuery();
  const deleteUser = api.account.deleteAccount.useMutation({
    onMutate: async () => {
      setDeleteLoading(true);
      //Cancel fetching data if account is deleted.
      await sessionClient.account.getUserData.cancel();
    },
    onError: (err) => {
      toast.error(`An error occured deleting account. ${err.message}`);
    },
    onSettled: async () => {
      await sessionClient.account.getUserData.invalidate();
      setDeleteLoading(false);
      location.reload();
    },
  });

  const changeUserName = api.account.updateUserName.useMutation({
    onMutate: () => {
      return;
    },
    onError: (err) => {
      toast.error(`An error occured deleting account. ${err.message}`);
    },
    onSuccess: () => {
      return;
    },
  });
  const [newUsername, setNewUsername] = useState<string>("");
  const handleChangeUserName = () => {
    changeUserName.mutate(newUsername);
  };

  // useEffect(() => {
  //   if (typeof username === "string") {
  //     setCurrentUsername(username);
  //   }
  // }, [username]);

  if (status === "loading") {
    return <>Loading...</>;
  }
  return (
    <>
      <div className="flex flex-col justify-center gap-4 p-4 sm:flex-row">
        <ul className="menu rounded-box menu-normal w-full bg-base-300 p-2 sm:w-52 sm:max-w-sm">
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
          <table className="w-full sm:table-compact sm:table">
            <tbody>
              <tr>
                <td className="bg-base-300">
                  <div className="flex flex-row items-center gap-2 sm:gap-8 sm:px-4">
                    <img
                      className="h-16 w-16 rounded-full border-2 border-black"
                      src={getUser.data?.image ?? ""}
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
                      <span className="text-base">Username: {newUsername}</span>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm">Change Username</label>
                        <div className="flex flex-col gap-4 sm:flex-row">
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
                      Email: {getUser.data?.email ?? ""}
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
                    {!deleteLoading ? (
                      <button
                        className="btn-error btn-sm btn w-fit bg-red-600 text-white hover:bg-red-800"
                        onClick={() => deleteUser.mutate()}
                      >
                        Delete Account
                      </button>
                    ) : (
                      <button className="btn-disabled btn-sm btn w-fit bg-red-600 text-white hover:bg-red-800">
                        <div className="flex gap-4">
                          <span>Delete Account</span>
                          <div role="status">
                            <svg
                              aria-hidden="true"
                              className="mr-2 inline h-4 w-4 animate-spin fill-white text-gray-200 dark:text-gray-600"
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                              />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                              />
                            </svg>
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Layout(Settings);
