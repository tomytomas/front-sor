import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  Badge,
  Divider,
  Button,
  Box,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const userId = sessionStorage.getItem("user_id");
  const navigate = useNavigate();
  const endpoint = `/messages/unread/${userId}`

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL_USERS || "http://localhost:8080/datos/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error al obtener los usuarios:", error));

    if (userId) {
      axios
        .get( process.env.REACT_APP_BACKEND_URL + endpoint )
        .then((response) => setUnreadMessages(response.data))
        .catch((error) => console.error("Error al obtener mensajes no leídos:", error));
    }
  }, [userId]);

  const handleUserClick = async (chatUserId, userName) => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL_PUBLIC_KEY || `http://localhost:8080/messages/public-key`);
      const publicKey = response.data.publicKey;
      sessionStorage.setItem(`publicKey_${chatUserId}`, publicKey);
      sessionStorage.setItem("userSelected", userName);
      navigate(`/chat/${userId}/${chatUserId}`);
    } catch (error) {
      console.error("Error al obtener la clave pública del usuario:", error);
    }
  };

  const logoutUser = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: "#64b5f6" }}>
          Usuarios
        </Typography>
        <Button variant="contained" color="error" onClick={logoutUser}>
          Logout
        </Button>
      </Box>

      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 3,
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <CardActionArea onClick={() => handleUserClick(user.id, user.name)}>
                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
                    <Person />
                  </Avatar>
                  <Typography variant="h6" fontWeight="medium">
                    {user.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 5 }} />

      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#64b5f6" }}>
        Mensajes no leídos
      </Typography>

      {unreadMessages.length > 0 ? (
        <Grid container spacing={3}>
          {unreadMessages.map((message) => (
            <Grid item xs={12} sm={6} md={4} key={message.id}>
              <Card sx={{ borderRadius: 4, boxShadow: 2, p: 2 }}>
                <CardContent>
                  <Badge
                    color="secondary"
                    badgeContent="Nuevo"
                    sx={{ mb: 1, "& .MuiBadge-badge": { fontSize: 10, top: 8 } }}
                  />
                  <Typography variant="subtitle2" color="text.secondary">
                    De: <strong>{message.senderName}</strong>
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {message.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                    {new Date(message.createdAt).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary" mt={2} sx={{ color: "#64b5f6" }}>
          No tienes mensajes no leídos.
        </Typography>
      )}
    </Container>
  );
}
