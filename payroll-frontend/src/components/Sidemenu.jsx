import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip"; // Importación corregida
import HomeIcon from "@mui/icons-material/Home";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import HelpIcon from "@mui/icons-material/Help";
import { useNavigate } from "react-router-dom";

export default function Sidemenu({ open, toggleDrawer }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isEjecutive = user?.isEjecutive || false;
  const isLoggedIn = !!user;

  const handleNavigation = (path) => {
    navigate(path);
    toggleDrawer(false)(); // Cierra el menú al navegar
  };

  const listOptions = () => (
    <Box role="presentation" sx={{ width: 250 }}>
      <List>
        <Tooltip title="Página principal" arrow>
          <ListItemButton onClick={() => handleNavigation("/home")}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </Tooltip>

        <Divider />

        {isLoggedIn && isEjecutive && (
          <>
            <Tooltip title="Simular un crédito para un cliente" arrow>
              <ListItemButton onClick={() => handleNavigation("/simulateCredit")}>
                <ListItemIcon>
                  <RequestQuoteIcon />
                </ListItemIcon>
                <ListItemText primary="Simular Crédito" />
              </ListItemButton>
            </Tooltip>

            <Tooltip title="Revisar solicitudes pendientes" arrow>
              <ListItemButton onClick={() => handleNavigation("/creditRequestTable")}>
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Solicitudes por revisar" />
              </ListItemButton>
            </Tooltip>

            <Divider />
          </>
        )}

        {isLoggedIn && !isEjecutive && (
          <>
            <Tooltip title="Simula un crédito rápidamente" arrow>
              <ListItemButton onClick={() => handleNavigation("/simulateCredit")}>
                <ListItemIcon>
                  <RequestQuoteIcon />
                </ListItemIcon>
                <ListItemText primary="Simular Crédito" />
              </ListItemButton>
            </Tooltip>

            <Tooltip title="Consulta tus solicitudes de crédito" arrow>
              <ListItemButton onClick={() => handleNavigation("/userCreditTable")}>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Mis Solicitudes" />
              </ListItemButton>
            </Tooltip>

            <Tooltip title="Solicita un nuevo crédito" arrow>
              <ListItemButton onClick={() => handleNavigation("/CreditRequest")}>
                <ListItemIcon>
                  <CreditScoreIcon />
                </ListItemIcon>
                <ListItemText primary="Solicitar Crédito" />
              </ListItemButton>
            </Tooltip>
          </>
        )}

        {!isLoggedIn && (
          <Tooltip title="Simula un crédito sin registrarte" arrow>
            <ListItemButton onClick={() => handleNavigation("/simulateCredit")}>
              <ListItemIcon>
                <RequestQuoteIcon />
              </ListItemIcon>
              <ListItemText primary="Simular Crédito" />
            </ListItemButton>
          </Tooltip>
        )}

        <Tooltip title="Ayuda y soporte técnico" arrow>
          <ListItemButton onClick={() => handleNavigation("/help")}>
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText primary="Ayuda" />
          </ListItemButton>
        </Tooltip>
      </List>
    </Box>
  );

  return (
    <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
      {listOptions()}
    </Drawer>
  );
}
