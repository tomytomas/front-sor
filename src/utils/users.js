import axios from 'axios';

const API_URL = 'http://localhost:3006';

export const loginWithGoogle = async (credential) => {
  try {
    const response = await axios.post(
     
      `${API_URL}/auth/google`,
      { token: credential },
      {
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    if (response.status === 200) {
      const data = response.data;

      if (data) {
        return data;
      } else {
        console.error("El token no está presente en la respuesta");
        throw new Error("Token no recibido");
      }
    } else {
      console.error("Respuesta no OK del backend:", response.statusText);
      throw new Error("Error al registrar o iniciar sesión con Google");
    }
  } catch (error) {
    console.error("Error en la solicitud de registro/inicio de sesión:", error);
    throw error;
  }
};

export const verifyEmailCode = async (email, code) => {
  const response = await axios.post(`${API_URL}/verify-email`, {
    email,
    code
  });
  return response.data;
};

export const resendVerificationCode = async (email) => {
  const res = await axios.post(`${API_URL}/resend-code`, { mail: email });
  return res.data;
};