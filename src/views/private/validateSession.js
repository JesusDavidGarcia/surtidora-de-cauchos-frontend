import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Home from "./home";

export default function ValidateSession(props) {
  const isLoggedin = Boolean(localStorage.getItem("userInfo"));
  const [isValidSession, setValidSession] = useState(isLoggedin);

  useEffect(() => {
    setValidSession(isLoggedin);
  }, [isLoggedin]);

  if (isValidSession) {
    return <Home />;
  } else {
    return <Navigate to="/login" />;
  }
}
