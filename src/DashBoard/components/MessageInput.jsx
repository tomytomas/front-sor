import React from "react";
import { TextField, Button, Box } from "@mui/material";

export default function MessageInput({ newMessage, setNewMessage, handleSendMessage }) {
  return (
    <Box mt={2}>
      <TextField
        fullWidth
        label="Escribe un mensaje"
        variant="outlined"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSendMessage}
        sx={{ mt: 2 }}
      >
        Enviar
      </Button>
    </Box>
  );
}
