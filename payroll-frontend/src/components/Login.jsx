import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import userClient from "../services/userClient.service";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(""); // Error de validación del correo
  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Regex para validar el formato del correo electrónico
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const emailInput = e.target.value;
    setEmail(emailInput);
    if (!validateEmail(emailInput)) {
      setEmailError("El correo electrónico no tiene un formato válido.");
    } else {
      setEmailError(""); // Resetea el error si es válido
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    // Validación previa en el cliente
    if (!validateEmail(email)) {
      setError("El correo electrónico no es válido.");
      setLoading(false);
      return;
    }

    try {
      const response = await userClient.login(email, password);

      if (response.status === 200) {
        const data = response.data;
        console.log("Inicio de sesión exitoso:", data);

        // Guarda el usuario en el almacenamiento local
        localStorage.setItem("user", JSON.stringify(data));

        // Notifica cambios en localStorage para actualización en otros componentes
        window.dispatchEvent(new Event("storage"));

        // Redirige a la página principal
        navigate("/home");
      } else if (response.status === 401) {
        setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
      } else {
        setError("Ocurrió un error. Inténtalo más tarde.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Paper elevation={3} sx={{ padding: 4, width: "400px" }}>
          <Typography variant="h5" component="h1" align="center" gutterBottom>
            Iniciar Sesión
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Correo Electrónico"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={handleEmailChange} // Usamos handleEmailChange para validación en tiempo real
              required
              error={!!emailError} // Si hay error, cambia el estilo del TextField
              helperText={emailError} // Muestra el error debajo del campo de correo
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Box textAlign="center">
              <Link href="/recover-password" variant="body2">
                ¿Olvidaste tu contraseña?
              </Link>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
              disabled={!!emailError || loading} // Deshabilita el botón si hay error en el correo o si está cargando
            >
              Iniciar Sesión
            </Button>
          </form>
        </Paper>
      </Box>

      <Backdrop
        open={loading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
