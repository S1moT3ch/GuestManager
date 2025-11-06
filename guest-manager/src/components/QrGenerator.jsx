import React, { useState } from "react";
import {
    Container,
    Typography,
    Button,
    Card,
    CardContent,
} from "@mui/material";
import * as XLSX from "xlsx";
import { QRCodeSVG } from "qrcode.react";

export default function QrGenerator() {
    const [excelData, setExcelData] = useState([]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            setExcelData(jsonData);
        };
        reader.readAsArrayBuffer(file);
    };

    const downloadQR = (id, nome, cognome) => {
        const svg = document.getElementById(id);
        if (!svg) return;

        const serializer = new XMLSerializer();
        const svgStr = serializer.serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const img = new Image();
        const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);

            const pngImg = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = pngImg;
            a.download = `${nome}_${cognome}.png`;
            a.click();
        };
        img.src = url;
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                p: 2,
            }}
        >
            <Typography variant="h5" gutterBottom>
                🖨 Generatore QR Code
            </Typography>

            <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mb: 2 }}
            >
                Carica file Excel
                <input
                    type="file"
                    hidden
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                />
            </Button>

            {excelData.length === 0 && (
                <Typography>Nessun dato caricato.</Typography>
            )}

            {excelData.map((row, idx) => {
                const nome = row.Nome || "";
                const cognome = row.Cognome || "";
                const qrValue = `${nome} ${cognome}`;
                const qrId = `qr-${idx}`;

                return (
                    <Card
                        key={idx}
                        sx={{
                            width: "100%",
                            p: 2,
                            borderRadius: 3,
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div>
                            <Typography variant="body1">
                                {nome} {cognome}
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => downloadQR(qrId, nome, cognome)}
                            >
                                Scarica
                            </Button>
                        </div>
                        <QRCodeSVG value={qrValue} size={80} />
                    </Card>
                );
            })}
        </Container>
    );
}