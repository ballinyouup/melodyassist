import Logo from "./Navbar/Logo";
import Dropdown from "./Navbar/Dropdown";
import ToggleDark from "./Navbar/ToggleDark";
import LogIn from "./Navbar/LogIn";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import ToggleOffline from "./Navbar/ToggleOffline";
import { type User } from "@prisma/client";
import { toast } from "react-hot-toast";

const Navbar: React.FC = () => {
  const { data, status } = useSession();
  const apiClient = api.useContext();
  const userData = api.account.getUserData.useQuery();
  const updateTheme = api.account.updateTheme.useMutation({
    onMutate: async () => {
      await apiClient.account.getUserData.cancel();
      const prevData = apiClient.account.getUserData.getData();
      const updatedData: User = {
        ...prevData,
        theme: prevData?.theme === "winter" ? "night" : "winter",
      } as User;
      apiClient.account.getUserData.setData(undefined, () => updatedData);
    },
    onError: () => {
      toast.error("Error switching Theme!");
      const prevData = apiClient.account.getUserData.getData();
      apiClient.account.getUserData.setData(undefined, () => prevData);
    },
    onSuccess: () => {
      toast.success("Saved Theme!");
    },
  });

  const handleTheme = () => {
    updateTheme.mutate();
  };
  if (data === null && status !== "loading") {
    return (
      <div className={`navbar bg-base-100`}>
        <div className="navbar-start">
          <Logo />
        </div>
        <div className="navbar-end w-full gap-4">
          <ToggleOffline />
          <LogIn />
        </div>
      </div>
    );
  }
  return (
    <div className={`navbar bg-base-100`} data-theme={userData.data?.theme}>
      <div className="navbar-start">
        <Logo />
      </div>
      <div className="navbar-end w-full gap-4">
        <ToggleDark handleTheme={handleTheme} />
        {status === "loading" ? (
          <label
            tabIndex={0}
            className="swap swap-rotate btn-circle object-cover"
          >
            <div className="h-10 w-10 animate-pulse rounded-full border border-black bg-primary-content" />
          </label>
        ) : (
          <>
            <Dropdown />
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
