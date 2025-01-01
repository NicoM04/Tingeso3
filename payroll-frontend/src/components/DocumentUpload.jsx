import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Button, Box, Input, CircularProgress, Snackbar } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import DocumentService from '../services/document.service';
import CreditService from '../services/credit.service';

const DocumentUpload = () => {
    const { creditId } = useParams();
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [requiredDocuments, setRequiredDocuments] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false); // Para el mensaje de éxito

    const fetchCreditTypeDocuments = async () => {
        try {
            const creditResponse = await CreditService.get(creditId);
            const creditType = creditResponse.data.typeLoan;

            switch (creditType) {
                case 1:
                    setRequiredDocuments(["Comprobante de ingresos", "Certificado de avalúo", "Historial crediticio"]);
                    break;
                case 2:
                    setRequiredDocuments(["Comprobante de ingresos", "Certificado de avalúo", "Escritura de la primera vivienda", "Historial crediticio"]);
                    break;
                case 3:
                    setRequiredDocuments(["Estado financiero del negocio", "Comprobante de ingresos", "Certificado de avalúo", "Plan de negocios"]);
                    break;
                case 4:
                    setRequiredDocuments(["Comprobante de ingresos", "Presupuesto de la remodelación", "Certificado de avalúo actualizado"]);
                    break;
                default:
                    setRequiredDocuments([]);
            }
        } catch (err) {
            setError("Error al obtener el crédito: " + err.message);
        }
    };

    useEffect(() => {
        fetchCreditTypeDocuments();
    }, [creditId]);

    const handleFileChange = (event, index) => {
        const newDocuments = [...documents];
        newDocuments[index] = event.target.files[0];
        setDocuments(newDocuments);
    };

    const handleSubmit = async () => {
        if (documents.length !== requiredDocuments.length) {
            setError(`Debe subir todos los documentos requeridos (${requiredDocuments.length} documentos).`);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await DocumentService.uploadDocuments(documents, creditId);
            setOpenSnackbar(true); // Mostrar mensaje de éxito
            navigate('/home');
        } catch (err) {
            setError("Error al subir documentos: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} style={{ padding: '2rem' }}>
                        <Typography variant="h5" align="center" gutterBottom>
                            Subir Documentos
                        </Typography>

                        {requiredDocuments.length === 0 ? (
                            <Typography color="error" align="center">No se pudieron cargar los documentos requeridos.</Typography>
                        ) : (
                            requiredDocuments.map((doc, index) => (
                                <Box key={index} mt={2}>
                                    <Typography>{doc}:</Typography>
                                    <Input
                                        type="file"
                                        onChange={(event) => handleFileChange(event, index)}
                                        fullWidth
                                        required
                                        error={documents[index] === undefined}
                                    />
                                </Box>
                            ))
                        )}

                        {error && (
                            <Typography color="error" mt={2}>
                                {error}
                            </Typography>
                        )}

                        {loading && (
                            <Box mt={2} display="flex" justifyContent="center">
                                <CircularProgress />
                            </Box>
                        )}

                        <Box mt={4} textAlign="center">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Subiendo...' : 'Subir Documentos'}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                message="Documentos subidos correctamente."
            />
        </>
    );
};

export default DocumentUpload;
