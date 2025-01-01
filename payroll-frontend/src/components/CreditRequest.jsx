import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Button, CircularProgress, Tooltip } from '@mui/material';
import CreditService from '../services/credit.service';
import { useNavigate } from 'react-router-dom';

const creditTypes = [
    { id: 1, name: "Primera Vivienda", maxTerm: 30, interestRate: "3.5%-5%", description: "Ideal para compra de tu primera vivienda." },
    { id: 2, name: "Segunda Vivienda", maxTerm: 20, interestRate: "4%-6%", description: "Perfecto para la adquisición de una segunda vivienda." },
    { id: 3, name: "Tercera Vivienda", maxTerm: 25, interestRate: "5%-7%", description: "Para la compra de tu tercera vivienda." },
    { id: 4, name: "Cuarta Vivienda", maxTerm: 15, interestRate: "4.5%-6%", description: "Ideal para la adquisición de una cuarta propiedad." },
];

const CreditRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCreditType, setSelectedCreditType] = useState(null);
    const [amount, setAmount] = useState(0); // Nuevo estado para el monto
    const [dueDate, setDueDate] = useState(0); // Nuevo estado para el plazo
    const [errorAmount, setErrorAmount] = useState('');
    const [errorDueDate, setErrorDueDate] = useState('');
    const navigate = useNavigate();
    const [idClient, setUserId] = useState(null);

    // Obtener el ID del usuario desde localStorage o un contexto de autenticación
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
            setUserId(user.id);
        } else {
            // Redirigir o mostrar error si no hay usuario autenticado
            setError("Debe iniciar sesión para solicitar un crédito.");
        }
    }, []);

    // Manejar la selección del tipo de crédito
    const handleCreditTypeChange = (event) => {
        const creditTypeId = parseInt(event.target.value);
        const selectedType = creditTypes.find(type => type.id === creditTypeId);
        setSelectedCreditType(selectedType); // Establecer el tipo de crédito seleccionado
        setAmount(0); // Reiniciar monto
        setDueDate(0); // Reiniciar plazo
        setErrorAmount('');
        setErrorDueDate('');
    };

    // Validar monto
    const validateAmount = (value) => {
        if (value <= 0) {
            setErrorAmount('El monto debe ser mayor que 0');
        } else {
            setErrorAmount('');
        }
    };

    // Validar plazo
    const validateDueDate = (value) => {
        if (value <= 0 || value > selectedCreditType.maxTerm) {
            setErrorDueDate(`El plazo debe estar entre 1 y ${selectedCreditType.maxTerm} años`);
        } else {
            setErrorDueDate('');
        }
    };

    // Manejar el envío del formulario
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (errorAmount || errorDueDate) {
            return; // Evita el envío si hay errores
        }

        const creditRequest = {
            typeLoan: selectedCreditType.id,
            amount: amount, // Monto proporcionado por el usuario
            interestRate: Math.max(...selectedCreditType.interestRate.split('%')[0].split('-').map(parseFloat)),
            dueDate: dueDate, // Plazo proporcionado por el usuario
            idClient: idClient, // Asignar el ID del usuario autenticado
            state: 1
        };

        try {
            setLoading(true);
            setError(null);
            // Guardar el crédito en el backend
            const saveResponse = await CreditService.create(creditRequest);
            const savedCreditId = saveResponse.data.id;
            console.log('Crédito guardado con ID:', savedCreditId);

            // Redirigir a la página de carga de documentos con el ID del crédito
            navigate(`/upload-documents/${savedCreditId}`);
        } catch (err) {
            setError("Error al crear la solicitud de crédito: " + err.message);
            console.error('Error en la solicitud de crédito:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!idClient) {
        return (
            <Typography color="error" align="center" mt={2}>
                {error}
            </Typography>
        );
    }

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
            <Grid item xs={12} md={8}>
                <Paper elevation={3} style={{ padding: '2rem' }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Solicitar Crédito
                    </Typography>

                    <FormControl component="fieldset" fullWidth margin="normal">
                        <FormLabel component="legend">Selecciona el tipo de crédito</FormLabel>
                        <RadioGroup row onChange={handleCreditTypeChange}>
                            {creditTypes.map((type) => (
                                <FormControlLabel
                                    key={type.id}
                                    value={type.id}
                                    control={<Radio />}
                                    label={
                                        <Tooltip title={type.description} arrow>
                                            <span>{`${type.name} - Plazo máximo: ${type.maxTerm} años, Tasa de interés: ${type.interestRate}`}</span>
                                        </Tooltip>
                                    }
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>

                    {selectedCreditType && (
                        <>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Monto del Préstamo"
                                type="number"
                                value={amount}
                                onChange={(e) => {
                                    const newAmount = e.target.value;
                                    setAmount(newAmount);
                                    validateAmount(newAmount);
                                }}
                                required
                                error={!!errorAmount}
                                helperText={errorAmount}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Plazo (en años)"
                                type="number"
                                value={dueDate}
                                onChange={(e) => {
                                    const newDueDate = e.target.value;
                                    setDueDate(newDueDate);
                                    validateDueDate(newDueDate);
                                }}
                                required
                                error={!!errorDueDate}
                                helperText={errorDueDate}
                            />
                            <Button variant="contained" onClick={handleSubmit} fullWidth disabled={loading || errorAmount || errorDueDate}>
                                Solicitar Crédito
                            </Button>
                        </>
                    )}

                    {error && (
                        <Typography color="error" mt={2}>
                            {error}
                        </Typography>
                    )}

                    {loading && (
                        <CircularProgress style={{ display: 'block', margin: '20px auto' }} />
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default CreditRequest;
