import { api } from "~/utils/api";

const Stats = () => {
  const { data: userAudios } = api.audio.getFeed.useQuery();
  const { data: users, isLoading: userCountLoading } =
    api.account.getUserCount.useQuery();
  return (
    <div className="flex w-full flex-col items-center justify-center sm:pb-8">
      <div className="stats w-full grid-flow-row justify-center border border-gray-500 border-opacity-20 p-5 text-center sm:w-fit sm:grid-flow-col md:mt-2">
        <div className="stat border-none">
          <div className="stat-title font-bold text-black text-opacity-80">
            Samples Uploaded
          </div>
          <div className="stat-value text-black">
            {!userCountLoading ? userAudios?.length : "0"}
          </div>
        </div>
        <div className="divider hidden h-4/5 sm:flex" />
        <div className="stat border-none">
          <div className="stat-title font-bold text-black">Total Users</div>
          <div className="stat-value text-black">
            {!userCountLoading ? users?.length : "0"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
