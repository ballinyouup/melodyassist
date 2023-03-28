import { api } from "~/utils/api";
import Layout from "./Layout";

function Profile() {
    const userData = api.account.getUserData.useQuery()
  return <div className="h-screen" data-theme={userData.data?.theme}>Profile</div>;
}

export default Layout(Profile);
