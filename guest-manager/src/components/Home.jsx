// ---------------- Home.js ----------------
import React, {useEffect, useState} from "react";
import {Container, Card, CardContent, Box, Button} from "@mui/material";
import SetupComponent from "./SetupComponent";
import ScannerComponent from "./ScannerComponent";
import QrGenerator from "./QrGenerator";

export default function Home() {
    const [setupData, setSetupData] = useState(null);
    const [isGenerator, setIsGenerator] = useState(false);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            const message = "Warning: if you refresh or close this page, you will lose all the unsaved changes";

            event.preventDefault();
            alert(message);
            return message;
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [])

    return (
        <Box>
            {!setupData ? (
                <Card sx={{ marginX: "5vw", marginTop: 3, p: 2, borderRadius: 3, boxShadow: 3 }}>
                    <CardContent>
                        <SetupComponent onSetupComplete={setSetupData} />
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={() => setIsGenerator(!isGenerator)}
                        >
                            {isGenerator ? "Chiudi Generatore QR" : "Generatore QR Code"}
                        </Button>

                        {isGenerator && <QrGenerator />}
                    </CardContent>
                </Card>
            ) : (
                <ScannerComponent
                    excelData={setupData.excelData}
                    tavoloCorrente={setupData.tavoloCorrente}
                />
            )}
        </Box>
    );
}
