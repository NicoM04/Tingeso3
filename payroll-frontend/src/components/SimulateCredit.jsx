import React, { useState } from 'react';
import CreditService from '../services/credit.service';
import { 
    TextField, 
    Button, 
    Grid, 
    Paper, 
    Typography, 
    Box, 
    CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SimulateCredit = () => {
    const [creditData, setCreditData] = useState({
        amount: '',
        interestRate: '',
        dueDate: ''
    });
    const [error, setError] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Formatear número con separadores de miles
    const formatNumber = (value) => {
        return value.replace(/\D/g, '') // Eliminar caracteres no numéricos
                    .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Agregar puntos como separadores de miles
    };

    // Manejar el cambio de valores en los inputs y validación en tiempo real
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'amount') {
            const formattedValue = formatNumber(value);
            setCreditData({
                ...creditData,
                [name]: formattedValue.replace(/\./g, '') // Guardar valor sin puntos
            });
        } else {
            setCreditData({
                ...creditData,
                [name]: value
            });
        }

        // Validación en tiempo real
        validate(name, name === 'amount' ? value.replace(/\./g, '') : value);
    };

    // Validar un campo específico basado en el nombre
    const validate = (fieldName, value) => {
        let tempErrors = { ...error };

        switch (fieldName) {
            case 'amount':
                if (!value || value <= 10000000 || value>1000000000) {
                    tempErrors.amount = "El monto debe ser mayor a 10.000.000 y menor a 1.000.000.000";
                } else {
                    delete tempErrors.amount;
                }
                break;
            case 'interestRate':
                if (!value || value < 3.5 || value > 7) {
                    tempErrors.interestRate = "La tasa de interés debe ser mayor o igual a 3.5 y menor o igual al 7%";
                } else {
                    delete tempErrors.interestRate;
                }
                break;
            case 'dueDate':
                if (!value || value <= 0 || value > 30) {
                    tempErrors.dueDate = "El plazo debe ser mayor a 0 y menor o igual a 30 años";
                } else {
                    delete tempErrors.dueDate;
                }
                break;
            default:
                break;
        }

        setError(tempErrors);
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(error).length > 0) {
            return;
        }
        setLoading(true);
        setResult(null);

        try {
            const response = await CreditService.simulateCredit(creditData);
            setResult(response.data);
        } catch (error) {
            console.error("Error en simulateCredit:", error);
            setResult({ error: "Error al simular el crédito, ingresa datos detro de los rangos indicados." });
        } finally {
            setLoading(false);
        }
    };

    // Restablecer formulario
    const handleReset = () => {
        setCreditData({
            amount: '',
            interestRate: '',
            dueDate: ''
        });
        setResult(null);
        setError({});
    };

    // Redirigir al usuario a la página de inicio
    const handleGoHome = () => {
        navigate('/home');
    };

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
            <Grid item xs={10} md={6} lg={4}>
                <Paper elevation={3} style={{ padding: '2rem' }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Simulación de Crédito Hipotecario
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Monto del Préstamo"
                            name="amount"
                            type="text"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            value={formatNumber(creditData.amount)}
                            onChange={handleChange}
                            error={!!error.amount}
                            helperText={error.amount}
                        />
                        <TextField
                            label="Tasa de Interés Anual (%)"
                            name="interestRate"
                            type="number"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            value={creditData.interestRate}
                            onChange={handleChange}
                            error={!!error.interestRate}
                            helperText={error.interestRate}
                        />
                        <TextField
                            label="Plazo (años)"
                            name="dueDate"
                            type="number"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            value={creditData.dueDate}
                            onChange={handleChange}
                            error={!!error.dueDate}
                            helperText={error.dueDate}
                        />
                        <Box textAlign="center" mt={2}>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary" 
                                disabled={loading || Object.keys(error).length > 0}
                            >
                                {loading ? 'Simulando...' : 'Simular Crédito'}
                            </Button>
                        </Box>
                    </form>

                    {result && (
                        <Box mt={4}>
                            {result.error ? (
                                <Typography color="error" align="center">
                                    {result.error}
                                </Typography>
                            ) : (
                                <Box>
                                    <Typography variant="h6" align="center">
                                        Resultado de la simulación
                                    </Typography>
                                    <Typography align="center">
                                        Pago mensual: ${Math.round(result.monthlyPayment)}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}

                    <Box textAlign="center" mt={2}>
                        <Button variant="outlined" onClick={handleReset}>
                            Restablecer
                        </Button>
                    </Box>

                    <Box textAlign="center" mt={2}>
                        <Button variant="outlined" onClick={handleGoHome}>
                            Ir a la página principal
                        </Button>
                    </Box>
                </Paper>
            </Grid>

            {loading && (
                <Box 
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                >
                    <CircularProgress />
                </Box>
            )}
        </Grid>
    );
};

export default SimulateCredit;
