// UserCreditTable.jsx
import React, { useState, useEffect } from 'react';
import CreditService from '../services/credit.service';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserCreditTable = () => {
    const [credits, setCredits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user.id : null;

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
        const fetchUserCredits = async () => {
            try {
                if (!userId) {
                    setError("ID de usuario no válido.");
                    return;
                }
                setLoading(true);
                const response = await CreditService.getCreditsByClientId(userId);
                setCredits(response.data);
            } catch (err) {
                console.error("Error al obtener los créditos del usuario:", err);
                setError("Error al cargar los créditos.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserCredits();
    }, [userId]);

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const filteredCredits = credits.filter((credit) => {
        if (!selectedStatus) return true; // Si no se selecciona un estado, mostrar todos
        return creditStatusMap[credit.state] === selectedStatus;
    });

    return (
        <Container>
            <Typography variant="h4" gutterBottom align="center">
                Mis Solicitudes de Crédito
            </Typography>
            <Grid container justifyContent="center" marginBottom={2}>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined" sx={{ backgroundColor: 'white' }}>
                        <InputLabel sx={{ color: 'black' }}>Filtrar por Estado</InputLabel>
                        <Select
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            label="Filtrar por Estado"
                            sx={{
                                backgroundColor: 'white',
                                color: 'black',
                                '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'black',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'black',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'black',
                                },
                                '.MuiMenuItem-root': {
                                    backgroundColor: 'white',
                                    color: 'black',
                                },
                            }}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        backgroundColor: 'white',
                                        color: 'black',
                                    },
                                },
                            }}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {Object.values(creditStatusMap).map((status, index) => (
                                <MenuItem key={index} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error" align="center">{error}</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Monto</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Tipo de Préstamo</TableCell>
                                <TableCell>Fecha de Solicitud</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCredits.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No se encontraron resultados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCredits.map((credit) => (
                                    <TableRow key={credit.id}>
                                        <TableCell>{credit.id}</TableCell>
                                        <TableCell>{credit.amount}</TableCell>
                                        <TableCell>{creditStatusMap[credit.state] || 'Estado Desconocido'}</TableCell>
                                        <TableCell>{credit.typeLoan}</TableCell>
                                        <TableCell>{new Date(credit.requestDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => navigate(`/userCreditDetails/${credit.id}`)}
                                            >
                                                Ver Detalles
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default UserCreditTable;
