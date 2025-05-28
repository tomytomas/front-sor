import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
  

// importamos la vista del Home

//COMPONENTES DEL DASHBOARD
import DashboardView from "../DashBoard/pages/DashboardView";
import Chat from "../DashBoard/components/Chat";
//SISTEMA DE LOGIN, REGISTRO Y LOG OUT

// import NotFound from "../pages/NotFound/index";
// import AdminPage from "../pages/Admin";
 import Login from "../Pages/pages/SignIn";


export function AppRoutes() {

  return (
      <Routes>
         {/* Home */}
        <Route path="/" element={<Login />} />
       

        {/* Dashboard */}
        <Route path="/dashboardview" element={<DashboardView />} />
        <Route path="/chat/:userId/:chatUserId" element={<Chat />} />

      

        <Route
        path="/shop"
        element={<Navigate to="/dashboardview" replace />}
        />

       
        {/* <Route path="*" element={<NotFound />} /> */}
        {/* <Route path="/admin" element={<AdminPage/>} /> */}
      
       
      </Routes>
  );
}