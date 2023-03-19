import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Layout = (WrappedComponent: React.FC): React.FC => {
  const WithLayout: React.FC = (props) => (
    <div>
      <Navbar />
      <Toaster />
      <WrappedComponent {...props} />
      <Footer />
    </div>
  );
  return WithLayout;
};

export default Layout;
