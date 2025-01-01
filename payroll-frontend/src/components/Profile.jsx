import React, { useState, useEffect } from "react";
import { Container, Typography, Paper, Grid, CircularProgress, Button, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const navigate = useNavigate(); // Para navegación

  // Recupera el usuario del almacenamiento local
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false); // Deja de cargar después de obtener los datos
  }, []);

  // Función para manejar la edición del perfil (placeholder por ahora)
  const handleEditProfile = () => {
    // Aquí puedes redirigir a una página de edición, si se implementa
    navigate("/edit-profile");
  };

  return (
    <Container maxWidth="sm" style={{ padding: "20px", marginTop: "20px" }}>
      <Paper elevation={3} style={{ padding: "20px", borderRadius: "8px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Mi Perfil
        </Typography>

        {/* Indicador de carga mientras se obtiene la información del usuario */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
            <CircularProgress />
          </div>
        ) : user ? (
          <Grid container spacing={3}>
            {/* Tarjetas para cada sección del perfil */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="textSecondary">
                    <strong>ID:</strong>
                  </Typography>
                  <Typography variant="body1" color="textPrimary">
                    {user.id}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="textSecondary">
                    <strong>Nombre:</strong>
                  </Typography>
                  <Typography variant="body1" color="textPrimary">
                    {user.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="textSecondary">
                    <strong>Email:</strong>
                  </Typography>
                  <Typography variant="body1" color="textPrimary">
                    {user.mail}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="textSecondary">
                    <strong>Teléfono:</strong>
                  </Typography>
                  <Typography variant="body1" color="textPrimary">
                    {user.phoneN}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="h6" color="error" align="center">
            No has iniciado sesión.
          </Typography>
        )}

        {/* Botón de editar perfil */}
        {user && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Button variant="contained" color="primary" onClick={handleEditProfile}>
              Editar Perfil
            </Button>
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;
