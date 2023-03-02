import React from "react";
import { Navigate } from "react-router-dom";
import { UseAuth } from "../../contexts/auth/AuthContext";

const Protected = ({ children }) => {
  const { user } = UseAuth();
  if (Object.keys(user).length === 0) {
    return <Navigate to="/" />;
  }

  return children;
};

export default Protected;
