import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = () => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setIsAuthenticated(false);
      setIsChecking(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);

      if (!decodedToken?.exp) {
        localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
        setIsChecking(false);
        return;
      }

      const expiryTime = decodedToken.exp * 1000;
      const remainingTime = expiryTime - Date.now();

      // Token already expired
      if (remainingTime <= 0) {
        localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
        setIsChecking(false);
        return;
      }
      setIsAuthenticated(true);
      setIsChecking(false);

      const timer = setTimeout(() => {
        localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
      }, remainingTime);

      return () => clearTimeout(timer);
    } catch (error) {
      console.log("Invalid JWT token:", error);

      localStorage.removeItem("accessToken");
      setIsAuthenticated(false);
      setIsChecking(false);
    }
  }, []);

  // Token check होने तक कुछ render न करें
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;