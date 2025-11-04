// ---------------- Home.js ----------------
import React, {useEffect, useState} from "react";
import {Container, Card, CardContent, Box} from "@mui/material";
import SetupComponent from "./SetupComponent";
import ScannerComponent from "./ScannerComponent";

export default function Home() {
    const [setupData, setSetupData] = useState(null);

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
                <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
                    <CardContent>
                        <SetupComponent onSetupComplete={setSetupData} />
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
