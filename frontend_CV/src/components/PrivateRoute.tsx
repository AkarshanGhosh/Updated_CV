import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * PrivateRoute component to protect routes that require authentication.
 * If the user is not authenticated (no token in localStorage), they are redirected to the login page.
 * Otherwise, the child components (the protected route's element) are rendered.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} [props.children] - The child components to render if authenticated.
 * @returns {React.ReactNode} The protected content or a redirect.
 */
const PrivateRoute = ({ children }) => {
  // Check if an authentication token exists in localStorage
  // This is a simple check; in a real app, you might also validate the token's expiry.
  const isAuthenticated = !!localStorage.getItem("token");

  if (!isAuthenticated) {
    // If not authenticated, redirect the user to the login page.
    // `replace` prop ensures that the login page replaces the current entry in history,
    // so the user can't just hit back to bypass login.
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children (the component for the protected route)
  // `Outlet` is used when PrivateRoute is a parent route and its children are nested routes.
  // `children` is used when PrivateRoute directly wraps a component as an element prop.
  return children ? children : <Outlet />;
};

export default PrivateRoute;