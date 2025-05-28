// src/routes/PrivateRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  
  useEffect(() => {
    const verifyToken = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return setIsAuth(false);

      try {
        const res = await axios.post("http://localhost:3006/verify", {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        res.status === 200 ? setIsAuth(true) : setIsAuth(false);
      } catch (err) {
        console.log("Error verifying token:", err);
        setIsAuth(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuth === null) return <div>Cargando...</div>;

  return isAuth ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
