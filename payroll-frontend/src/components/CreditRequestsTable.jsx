import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CreditService from '../services/credit.service';

const CreditRequestsTable = () => {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mapeo de los estados de los créditos
  const creditStatusMap = {
    1: 'En Revisión Inicial',
    2: 'Pendiente de Documentación',
    3: 'En Evaluación',
    4: 'Pre-Aprobada',
    5: 'En Aprobación Final',
    6: 'Aprobada',
    7: 'Rechazada',
    8: 'Cancelada por el Cliente',
    9: 'En Desembolso'
  };

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await CreditService.getAll();
        setCredits(response.data);
      } catch (error) {
        console.error('Error al obtener solicitudes de crédito:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, []);

  const handleViewDetails = (creditId) => {
    navigate(`/creditRequestDetail/${creditId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return 'blue'; // Ejemplo para "En Revisión Inicial"
      case 2:
        return 'orange'; // Ejemplo para "Pendiente de Documentación"
      case 3:
        return 'yellow'; // Ejemplo para "En Evaluación"
      case 4:
        return 'lightblue'; // Ejemplo para "Pre-Aprobada"
      case 5:
        return 'green'; // Ejemplo para "En Aprobación Final"
      case 6:
        return 'green'; // Ejemplo para "Aprobada"
      case 7:
        return 'red'; // Ejemplo para "Rechazada"
      case 8:
        return 'gray'; // Ejemplo para "Cancelada por el Cliente"
      case 9:
        return 'purple'; // Ejemplo para "En Desembolso"
      default:
        return 'gray';
    }
  };

  return (
    <TableContainer component={Paper}>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : credits.length === 0 ? (
        <Typography color="textSecondary" align="center" mt={2}>
          No hay solicitudes de crédito pendientes.
        </Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID de Cliente</TableCell>
              <TableCell>Tipo de Crédito</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {credits.map((credit) => (
              <TableRow key={credit.id}>
                <TableCell>{credit.idClient}</TableCell>
                <TableCell>{credit.typeLoan}</TableCell>
                <TableCell style={{ color: getStatusColor(credit.state) }}>
                  {creditStatusMap[credit.state] || 'Desconocido'}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleViewDetails(credit.id)}
                    variant="contained"
                    color="primary"
                    aria-label={`Ver detalles de la solicitud de crédito ${credit.id}`}
                  >
                    Ver Detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default CreditRequestsTable;
