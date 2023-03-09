import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";


const Layout = (WrappedComponent: React.FC): React.FC => {

  const WithLayout: React.FC = (props) => (
    <div>
      <Navbar />
      <Toaster />
      <WrappedComponent {...props} />
    </div>
  );
  return WithLayout;
};

export default Layout;

