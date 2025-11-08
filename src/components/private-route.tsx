import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const user = sessionStorage.getItem("user");
  return user ? children : <Navigate to="/" />;
}
