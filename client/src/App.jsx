import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Link } from 'react-router-dom';
import NavBar from './components/NavBar';
import AddBakeryPage from "./pages/bakery-pages/AddBakeryPage";
import HomePage from './pages/client-pages/HomePage';
import BakeryDetailsPage from './pages/client-pages/BakeryDetailsPage';
import CartPage from './pages/client-pages/CartPage';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/client-pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import CustomerProfilePage from './pages/client-pages/CustomerProfilePage';
import CustomOrderPage from './pages/client-pages/CustomOrderPage';
import ProtectedRoute from './components/ProtectedRoute';
import ParticlesBackground from './components/ParticlesBackground';
import ChooseRole from "./pages/ChooseRole";
import LoginBakeryPage from "./pages/bakery-pages/LoginBakeryPage";
import HomeBakeryPage from "./pages/bakery-pages/HomeBakeryPage";
import AddProductPage from "./pages/bakery-pages/AddProductPage";
import OrderListPage from "./pages/bakery-pages/OrderListPage";
import ProductListsPage from "./pages/bakery-pages/ProductListsPage";
import {CartProvider} from "./context/CartContext";
import ViewOrderDetailsClient from "./pages/client-pages/ViewOrderDetailsClient";
import ViewOrderDetailsBakery from "./pages/bakery-pages/ViewOrderDetailsBakeryPage";
import 'react-tooltip/dist/react-tooltip.css';
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      {/* Public Routes */}
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
        <Route path="/choice" element={<ChooseRole />} />
        <Route path="/add-bakery" element={<AddBakeryPage />} />
        <Route path="/login-bakery" element={<LoginBakeryPage />} />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
        <Route
            path="/home-bakery"
            element={
                <ProtectedRoute>
                    <HomeBakeryPage />
                </ProtectedRoute>
            }
        />
        <Route
            path="/add-product"
            element={
                <ProtectedRoute>
                    <AddProductPage />
                </ProtectedRoute>
            }
        />
      <Route
        path="/bakery-details/:bakeryId"
        element={
          <ProtectedRoute>
            <BakeryDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/custom-order/:bakeryId"
        element={
          <ProtectedRoute>
            <CustomOrderPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <CustomerProfilePage />
          </ProtectedRoute>
        }
        />
      <Route
          path="/bakery/order/:orderId"
          element={
              <ProtectedRoute>
                  <ViewOrderDetailsBakery/>
              </ProtectedRoute>
          }
      />
        <Route path="/order/:orderId" element={<ProtectedRoute><ViewOrderDetailsClient /></ProtectedRoute>} />
        <Route
            path="/orders-bakery"
            element={
                <ProtectedRoute>
                    <OrderListPage />
                </ProtectedRoute>
            }
        />
        <Route
            path="/products-bakery"
            element={
                <ProtectedRoute>
                    <ProductListsPage />
                </ProtectedRoute>
            }
        />

      {/* Add a catch-all route for 404 pages */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
      <CartProvider>
    <Router>
      <ParticlesBackground />
      <div className="flex flex-col min-h-screen relative z-10">
        <NavBar />
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>
        <footer className="py-4 text-center bg-white text-black">
          <p>&copy; 2024 Bakery Connect. All rights reserved.</p>
        </footer>
      </div>
    </Router>
      </CartProvider>
  );
}

export default App;

// NotFoundPage component
function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-blue-400 hover:underline">
        Go back to home
      </Link>
    </div>
  );
}
