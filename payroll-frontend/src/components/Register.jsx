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
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import userClient from "../services/userClient.service";

const Register = () => {
  const [name, setName] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState(null);
  const [rutError, setRutError] = useState(""); // Estado para el error de RUT
  const [emailError, setEmailError] = useState(""); // Estado para el error de correo
  const [phoneError, setPhoneError] = useState(""); // Estado para el error de teléfono
  const navigate = useNavigate();

  // Función para validar el RUT chileno
  const validateRut = (rutInput) => {
    const rut = rutInput.replace(/\./g, "").toUpperCase().replace("-", "");
    const rutNumber = rut.slice(0, -1);
    const dv = rut.slice(-1);
    
    let sum = 0;
    let mul = 2;
    for (let i = rutNumber.length - 1; i >= 0; i--) {
      sum += rutNumber[i] * mul;
      mul = mul === 7 ? 2 : mul + 1;
    }
    
    const dvCalculated = 11 - (sum % 11);
    const dvValid = dvCalculated === 11 ? "0" : dvCalculated === 10 ? "K" : dvCalculated.toString();
    
    return dvValid === dv;
  };

  // Función para validar el correo electrónico
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Función para validar el teléfono
  const validatePhone = (phone) => {
    const phoneRegex = /^\+569\d{8}$/; // Formato +56912345678
    return phoneRegex.test(phone);
  };

  // Funciones de validación en tiempo real
  const handleRutChange = (e) => {
    const value = e.target.value;
    setRut(value);
    setRutError(validateRut(value) ? "" : "El RUT ingresado no es válido.");
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value) ? "" : "El correo electrónico no es válido.");
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);
    setPhoneError(validatePhone(value) ? "" : "El teléfono no es válido.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setRutError(""); // Limpiar el error del RUT
    setEmailError(""); // Limpiar el error del correo
    setPhoneError(""); // Limpiar el error del teléfono
    setLoading(true);
    setValidating(true);

    // Validar campos antes de enviar el formulario
    if (rutError || emailError || phoneError) {
      setLoading(false);
      setValidating(false);
      return;
    }

    try {
      const response = await userClient.create({
        name,
        rut,
        mail: email,
        phoneN: phone,
        password,
        isEjecutive: false,
      });

      if (response.status === 200) {
        navigate("/login");
      } else {
        setError("Error al registrarse. Intenta de nuevo.");
      }
    } catch {
      setError("Error de conexión. Intenta más tarde.");
    } finally {
      setLoading(false);
      setValidating(false);
    }
  };

  const handleClear = () => {
    setName("");
    setRut("");
    setEmail("");
    setPhone("");
    setPassword("");
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
            Crear Cuenta
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombre Completo"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Tooltip title="Formato: 12345678-9" placement="top">
              <TextField
                label="RUT"
                variant="outlined"
                fullWidth
                margin="normal"
                value={rut}
                onChange={handleRutChange}
                required
                error={!!rutError}
                helperText={rutError}
              />
            </Tooltip>
            <TextField
              label="Correo Electrónico"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={handleEmailChange}
              required
              error={!!emailError}
              helperText={emailError}
            />
            <Tooltip title="Formato: +56912345678" placement="top">
              <TextField
                label="Teléfono"
                type="tel"
                variant="outlined"
                fullWidth
                margin="normal"
                value={phone}
                onChange={handlePhoneChange}
                required
                error={!!phoneError}
                helperText={phoneError}
              />
            </Tooltip>
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Registrarse
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{ marginTop: 2 }}
              onClick={handleClear}
            >
              Limpiar Formulario
            </Button>
            <Button
            variant="outlined"
            onClick={() => navigate("/home")}
            sx={{ marginBottom: 2 }}
          >
            Volver
          </Button>
          </form>
        </Paper>
      </Box>

      <Backdrop
        open={loading || validating}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
        {validating && (
          <Typography variant="h6" sx={{ marginLeft: 2, color: "white" }}>
            Validando datos...
          </Typography>
        )}
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

export default Register;
