import { Route, Routes } from "react-router-dom";
import { ToastProvider } from "@heroui/react"
import LoginPage from "@/pages/index";
import HomePage from "@/pages/home";
import CustomersPage from "@/pages/customers";
import ProductsPage from "@/pages/products";
import SalesPage from "@/pages/sales";
import ReportsPage from "@/pages/reports";
import UsersPage from "@/pages/users";
import PrivateRoute from "@/components/private-route";


function App() {
  return (
    <>
      <ToastProvider />
      <Routes>
        <Route element={<LoginPage />} path="/" />
        <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute><ProductsPage /></PrivateRoute>} />
        <Route path="/customers" element={<PrivateRoute><CustomersPage /></PrivateRoute>} />
        <Route path="/sales" element={<PrivateRoute><SalesPage /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default App;
