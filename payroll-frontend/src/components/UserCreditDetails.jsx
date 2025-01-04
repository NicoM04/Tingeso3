import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CreditService from '../services/credit.service';
import {
  Paper,
  Typography,
  Grid,
  Divider,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Snackbar,
} from '@mui/material';

const CreditDetails = () => {
  const { creditId } = useParams();
  const [credit, setCredit] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState(null); // "cancel" or "approve"
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const creditStates = {
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

  const loanTypes = {
    1: 'Primera Vivienda',
    2: 'Primera Vivienda',
    3: 'Propiedad comercial',
    4: 'Remodelación',
  };

  useEffect(() => {
    const fetchCreditDetails = async () => {
      try {
        setLoading(true);
        const creditResponse = await CreditService.get(creditId);
        setCredit(creditResponse.data);

        const userResponse = await CreditService.getUserByCreditId(creditId);
        setUser(userResponse.data);
      } catch (error) {
        console.error('Error fetching credit details:', error);
        setSnackbarMessage('No se pudo cargar la información del crédito. Intente nuevamente.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    if (creditId) {
      fetchCreditDetails();
    }
  }, [creditId]);

  const handleCancelCredit = async () => {
    try {
      await CreditService.updateCreditStatus(creditId, 8); // 8 represents "Cancelada por el Cliente"
      setCredit({ ...credit, state: 8 });
      setSnackbarMessage('Crédito cancelado exitosamente.');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error canceling credit:', error);
      setSnackbarMessage('Hubo un error al cancelar el crédito. Intente nuevamente.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setOpenConfirmDialog(false);
    }
  };

  const handleApproveCredit = async () => {
    try {
      await CreditService.updateCreditStatus(creditId, 5); // 5 represents "En Aprobación Final"
      setCredit({ ...credit, state: 5 });
      setSnackbarMessage('Crédito aprobado exitosamente.');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error approving credit:', error);
      setSnackbarMessage('Hubo un error al aprobar el crédito. Intente nuevamente.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setOpenConfirmDialog(false);
    }
  };

  const handleConfirmAction = () => {
    if (actionToConfirm === 'cancel') {
      handleCancelCredit();
    } else if (actionToConfirm === 'approve') {
      handleApproveCredit();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Detalles del Crédito
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : credit ? (
        <Paper elevation={3} style={{ padding: '20px', borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom>
            Información del Crédito
          </Typography>
          <Divider />
          <Grid container spacing={2} style={{ marginTop: '10px' }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Nombre del Cliente:</strong> {user ? user.name : 'Cargando...'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Tipo de Crédito:</strong> {loanTypes[credit.typeLoan] || 'Cargando...'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Estado:</strong>{' '}
                <span style={{ color: credit.state === 4 ? 'orange' : 'green' }}>
                  {creditStates[credit.state]}
                </span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Monto Solicitado:</strong> ${credit.amount}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Costo Total:</strong> ${Number(credit.totalCost).toFixed(0)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Fecha de Solicitud:</strong> {new Date(credit.requestDate).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Plazo:</strong> {credit.dueDate ? credit.dueDate : 'Cargando...'} años
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Tasa de Interés:</strong> {credit.interestRate}%
              </Typography>
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="space-between" mt={3}>
            {credit.state !== 8 && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setActionToConfirm('cancel');
                  setOpenConfirmDialog(true);
                }}
              >
                Cancelar Crédito
              </Button>
            )}

            {credit.state === 4 && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setActionToConfirm('approve');
                  setOpenConfirmDialog(true);
                }}
              >
                Aprobar Crédito
              </Button>
            )}
          </Box>
        </Paper>
      ) : (
        <Typography variant="body1">No se pudo cargar la información del crédito.</Typography>
      )}

      {/* Confirmación para Cancelar/ Aprobar Crédito */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirmar Acción</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Estás seguro de que deseas {actionToConfirm === 'cancel' ? 'cancelar' : 'aprobar'} este crédito?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmAction} color="secondary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mostrar mensajes de éxito/error */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  );
};

export default CreditDetails;
