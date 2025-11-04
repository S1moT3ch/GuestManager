import React, { useState, useEffect, useRef } from "react";
import {
    Button,
    Typography,
    Box,
    LinearProgress,
    Card,
    CardContent,
} from "@mui/material";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";

export default function SushiScanner({ excelData, tavoloCorrente }) {
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState("");
    const [progress, setProgress] = useState(0);
    const [searching, setSearching] = useState(false);
    const [stageText, setStageText] = useState("");
    const scannerRef = useRef(null);
    const readerRef = useRef(null);

    const stages = [
        "Analisi identificatore QR...",
        "Ricerca nel database...",
        "Verifica indice di gradimento alcolico...",
        "Calcolo valore simpatia...",
        "Analisi compatibilità con il tavolo...",
        "Verifica carta d'identità...",
        "Controllo punti patente...",
        "Attribuzione tavolo in corso...",
        "Richiesta aiuto a casa...",
        "Completamento operazione...",
    ];

    const simulateProgress = (callback) => {
        setProgress(0);
        setSearching(true);
        let i = 0;
        const totalSteps = 50;
        const interval = setInterval(() => {
            setProgress((prev) => {
                const next = prev + 100 / totalSteps;
                const stageIndex = Math.floor((next / 100) * stages.length);
                setStageText(stages[Math.min(stageIndex, stages.length - 1)]);
                return next;
            });
            i++;
            if (i >= totalSteps) {
                clearInterval(interval);
                setSearching(false);
                callback();
            }
        }, 150);
    };

    const handleScan = (text) => {
        if (!text) return;
        setScanning(false);

        simulateProgress(() => {
            const [nome, cognome] = text.trim().split(" ");
            if (!nome || !cognome) {
                setResult("⚠️ Il QR deve contenere Nome e Cognome separati da spazio.");
                return;
            }

            const found = excelData.find(
                (row) =>
                    row.Nome?.toLowerCase() === nome.toLowerCase() &&
                    row.Cognome?.toLowerCase() === cognome.toLowerCase()
            );

            if (!found) {
                setResult(`😕 ${nome} ${cognome} non è presente nella lista.`);
            } else if (found.Tavolo?.toString() === tavoloCorrente.toString()) {
                setResult(`Ciao ${nome} ${cognome}. Benvenuto. Questo è il tuo tavolo. Accomodati pure!`);
            } else {
                setResult(
                    `Ciao ${nome} ${cognome}, benvenuto! Hai seguito correttamente le indicazioni. Sei nel posto giusto
                    per festeggiare con me! Questo, però, non è il tavolo dove trascorrerai la serata. Devi ancora cercare.`
                );
            }

            setProgress(0);
            setStageText("");
        });
    };

    const handleError = (err) => console.error("Scanner error:", err);

    useEffect(() => {
        let isActive = true;
        const startScanner = async () => {
            if (!scannerRef.current && readerRef.current) {
                scannerRef.current = new Html5Qrcode(readerRef.current.id);
            }
            try {
                await scannerRef.current.start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: 250 },
                    handleScan,
                    handleError
                );
            } catch (err) {
                console.error("Errore avvio scanner:", err);
                if (isActive) setScanning(false);
            }
        };

        const stopScanner = async () => {
            if (
                scannerRef.current &&
                scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING
            ) {
                try {
                    await scannerRef.current.stop();
                } catch (err) {
                    console.error("Errore stop scanner:", err);
                }
            }
        };

        if (scanning) startScanner();
        else stopScanner();

        return () => {
            isActive = false;
            stopScanner();
        };
    }, [scanning]);

    const renderSciFiHorizontalBar = () => {
        const segments = 20;
        const activeSegments = Math.floor((progress / 100) * segments);

        return (
            <Box
                sx={{
                    width: 240,
                    height: 30,
                    backgroundColor: "#faf7f2",
                    border: "2px solid #f57c00",
                    borderRadius: 2,
                    margin: "20px auto",
                    padding: 2,
                    display: "flex",
                    flexDirection: "row",
                    gap: "2px",
                }}
            >
                {Array.from({ length: segments }).map((_, idx) => {
                    const isActive = idx < activeSegments;
                    return (
                        <Box
                            key={idx}
                            sx={{
                                flex: 1,
                                borderRadius: 1,
                                backgroundColor: isActive ? "#f57c00" : "#ffd3b9",
                                transition: "background-color 0.3s, box-shadow 0.3s",
                            }}
                        />
                    );
                })}
            </Box>
        );
    };

    const renderSciFiHorizontalStaticBar = () => {
        const segments = 20;
        const activeSegments = Math.floor((progress / 100) * segments);

        return (
            <Box
                sx={{
                    width: 240,
                    height: 30,
                    backgroundColor: "#faf7f2",
                    border: "2px solid #f57c00",
                    borderRadius: 2,
                    margin: "20px auto",
                    padding: 2,
                    display: "flex",
                    flexDirection: "row",
                    gap: "2px",
                }}
            >
                {Array.from({ length: segments }).map((_, idx) => {
                    return (
                        <Box
                            key={idx}
                            sx={{
                                flex: 1,
                                borderRadius: 1,
                                backgroundColor: "#f57c00",
                                boxShadow: "none",
                                transition: "background-color 0.3s, box-shadow 0.3s",
                            }}
                        />
                    );
                })}
            </Box>
        );
    };

    return (
        <Box
            sx={{
                width: "88vw",
                minHeight: "86vh",
                bgcolor: "#faf7f2",
                color: "#333",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
            }}
        >
            <Card
                sx={{
                    width: "90%",
                    maxWidth: 400,
                    borderRadius: 3,
                    boxShadow: 3,
                    p: 3,
                    textAlign: "center",
                    bgcolor: "#fff",
                }}
            >
                <CardContent>
                    <RestaurantMenuIcon sx={{ fontSize: 40, color: "#f57c00" }} />
                    <Typography variant="h5" sx={{ mb: 2, mt: 1 }}>
                        Guest Scanner
                    </Typography>

                    {!scanning ? (
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                bgcolor: "#f57c00",
                                "&:hover": { bgcolor: "#ef6c00" },
                                mb: 2,
                                mt: 2,
                                textTransform: "none",
                                borderRadius: 2,
                            }}
                            onClick={() => {
                                setResult("");
                                setProgress(0);
                                setStageText("");
                                setScanning(true);
                            }}
                            disabled={searching}
                        >
                            {searching ? "Scansione in corso..." : "Scannerizza QR code"}
                        </Button>
                    ) : (
                        <>
                            <div
                                ref={readerRef}
                                id="reader"
                                style={{
                                    width: "100%",
                                    maxWidth: "320px",
                                    height: "320px",
                                    margin: "auto",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    border: "2px solid #f57c00",
                                }}
                            />
                            <Button
                                variant="outlined"
                                fullWidth
                                sx={{
                                    mt: 2,
                                    borderColor: "#f57c00",
                                    color: "#f57c00",
                                    borderRadius: 2,
                                    "&:hover": { borderColor: "#ef6c00", color: "#ef6c00" },
                                }}
                                onClick={() => setScanning(false)}
                            >
                                Ferma scansione
                            </Button>
                        </>
                    )}

                    {progress > 0 && (
                        <>
                            <Typography variant="body2" sx={{ mt: 2 }}>
                                {stageText}
                            </Typography>
                            {renderSciFiHorizontalBar()}
                        </>
                    )}

                    {result && (
                        <>
                            {renderSciFiHorizontalStaticBar()}
                            <Box
                                sx={{
                                    mt: 3,
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: result.includes("però")
                                        ? "#ffebee"
                                        : "#e8f5e9",
                                    color: result.includes("però") ? "#c62828" : "#2e7d32",
                                }}
                            >
                                {result.includes("però") ? (
                                    <ErrorIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                                ) : (
                                    <CheckCircleIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                                )}
                                {result}
                            </Box>
                        </>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
