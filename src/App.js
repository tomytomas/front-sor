import React from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContextProvider } from "./Contexts/authContext";
import { AppLayout } from "./AppLayout";

export default function App() {
  return (
    <AuthContextProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthContextProvider>
  );
}