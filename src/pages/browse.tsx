import Layout from "./Layout";
import dynamic from "next/dynamic";

const BrowseFeed = dynamic(() => import("./components/Browse/BrowseFeed"), {
  ssr: false,
});
const Browse: React.FC = () => {
  return (
    <div className="h-screen">
      <main>
        <BrowseFeed />
      </main>
    </div>
  );
};

export default Layout(Browse);
