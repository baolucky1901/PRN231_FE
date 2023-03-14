import { CommonProvider } from "./contexts/common/commonContext";
import { CartProvider } from "./contexts/cart/cartContext";
import Header from "./components/common/Header";
import RouterRoutes from "./routes/RouterRoutes";
import Footer from "./components/common/Footer";
import BackTop from "./components/common/BackTop";
import { FiltersProvider } from "./contexts/filters/filtersContext";
import { AuthContextProvider } from "./contexts/auth/AuthContext";
import { ToastContainer } from "react-toastify";
import { FiltersEBookProvider } from "./contexts/filters/filtersEBookContext";

const App = () => {
  return (
    <>
      <AuthContextProvider>
        <CommonProvider>
          <FiltersProvider>
            <FiltersEBookProvider>
              <CartProvider>
                <Header />
                <RouterRoutes />
                <Footer />
                <BackTop />
                <ToastContainer />
              </CartProvider>
            </FiltersEBookProvider>
          </FiltersProvider>
        </CommonProvider>
      </AuthContextProvider>
    </>
  );
};

export default App;
