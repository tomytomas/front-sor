import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { encryptMessage } from "../../utils/crypto";

const socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:8080", {
  withCredentials: true,
});

export default function Chat() {
  const { userId, chatUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const userName = sessionStorage.getItem("userSelected");

  useEffect(() => {
    const roomId =
      userId < chatUserId ? `${userId}_${chatUserId}` : `${chatUserId}_${userId}`;

    socket.emit("join_room", { userId, chatUserId });

    socket.on("receive_message", (data) => {
      const decryptedMessage = data.message;
      setMessages((prev) => [
        ...prev,
        {
          ...data,
          message: decryptedMessage,
        },
      ]);
    });

    const endpoint = `/messages/${userId}/${chatUserId}`
    axios
      .get( process.env.REACT_APP_BACKEND_URL + endpoint )
      .then((response) => setMessages(response.data)+ console.log("Mensajes obtenidos:", response.data))
      .catch((error) => console.error("Error al obtener mensajes:", error));

    return () => {
      socket.off("receive_message");
      socket.emit("leave_room", { userId, chatUserId });
    };
  }, [userId, chatUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const publicKey = sessionStorage.getItem(`publicKey_${chatUserId}`);
      const encryptedMessage = encryptMessage(newMessage, publicKey);
      const senderName = sessionStorage.getItem("userName") || "Tú";
      console.log("Enviando mensaje:", {
        senderId: userId,
        receiverId: chatUserId,
        senderName,
        message: encryptedMessage,
      }); 
      const endpoin2 = `/messages/send`
      axios
        .post(process.env.REACT_APP_BACKEND_URL + endpoin2 , {
          senderId: userId,
          receiverId: chatUserId,
          senderName,
          message: encryptedMessage,
        })
        .then((response) => {
          const messageToSend = {
            id: response.data.id,
            senderId: userId,
            receiverId: chatUserId,
            senderName,
            message: newMessage,
            createdAt: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, messageToSend]);

          socket.emit("send_message", {
            ...messageToSend,
            message: encryptedMessage,
          });

          setNewMessage("");
        })
        .catch((error) => console.error("Error al enviar mensaje:", error));
    }
  };

  const Volver = () => {
    sessionStorage.removeItem("userSelected");
    navigate("/dashboardview");
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        sx={{ color: "#64b5f6", mb: 3 }}
      >
        Conversación con {userName || `usuario ${chatUserId}`}
      </Typography>

      <Box
        sx={{
          maxHeight: "60vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          px: 1,
        }}
      >
        <Grid container spacing={2} direction="column">
          {messages.map((message) => {
            const isOwnMessage = message.senderId === userId;
            return (
              <Grid
                item
                key={message.id}
                sx={{
                  display: "flex",
                  justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                }}
              >
                <Card
                  sx={{
                    backgroundColor: isOwnMessage ? "#e3f2fd" : "#f3f3f3",
                    maxWidth: "70%",
                    borderRadius: 4,
                    boxShadow: 2,
                  }}
                >
                  <CardContent>
                    <Typography variant="body1" color="text.primary">
                    {message.senderId === userId ? "Tú" : message.receiverName || message.senderName}:
                    {" " + message.message}
                  </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(message.createdAt).toLocaleString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      })}
                    </Typography>

                  </CardContent>
                </Card>
              </Grid>
            );
          })}
          <div ref={bottomRef} />
        </Grid>
      </Box>

      <Box mt={4}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
  fullWidth
  label="Escribe un mensaje"
  variant="outlined"
  value={newMessage}
  onChange={(e) => setNewMessage(e.target.value)}
  sx={{
    input: { color: "white" }, // color del texto
    label: { color: "white" }, // color del label
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white", // borde
      },
      "&:hover fieldset": {
        borderColor: "lightgray",
      },
      "&.Mui-focused fieldset": {
        borderColor: "lightblue",
      },
    },
  }}
  InputLabelProps={{ sx: { color: "white" } }} // también puedes asegurarte de que el label esté en blanco aquí
/>

          <Button variant="contained" color="primary" onClick={handleSendMessage}>
            Enviar
          </Button>
          <Button variant="contained" color="error" onClick={Volver}>
            Volver
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
