import React from "react";
import { useLocation } from "react-router-dom";
import { AppRoutes } from "./routes/index";

export const AppLayout = () => {
  const location = useLocation();
  const backgroundPages = ["/signin", "/signup", "/start", "/verify", "/success", "/resend", "/firststep", "/secondstep"];
  const isBgPage = backgroundPages.includes(location.pathname);

  return (
    <div className={`page-container ${isBgPage ? "with-background" : ""}`}>
      <main className="main-container">
        <AppRoutes />
      </main>
    
    </div>
  );
};
