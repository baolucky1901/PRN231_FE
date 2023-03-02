import { CommonProvider } from "./contexts/common/commonContext";
import { CartProvider } from "./contexts/cart/cartContext";
import Header from "./components/common/Header";
import RouterRoutes from "./routes/RouterRoutes";
import Footer from "./components/common/Footer";
import BackTop from "./components/common/BackTop";
import { FiltersProvider } from "./contexts/filters/filtersContext";
import { AuthContextProvider } from "./contexts/auth/AuthContext";

const App = () => {
  return (
    <>
      <AuthContextProvider>
        <CommonProvider>
          <FiltersProvider>
            <CartProvider>
              <Header />
              <RouterRoutes />
              <Footer />
              <BackTop />
            </CartProvider>
          </FiltersProvider>
        </CommonProvider>
      </AuthContextProvider>
    </>
  );
};

export default App;
