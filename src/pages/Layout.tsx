import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});


const Layout = (WrappedComponent: React.FC): React.FC => {
  const WithLayout: React.FC = (props) => (
    <div className={poppins.className}>
      <Navbar />
      <Toaster />
      <WrappedComponent {...props} />
      <Footer />
    </div>
  );
  return WithLayout;
};

export default Layout;
