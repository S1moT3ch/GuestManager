import React, { useState, useEffect } from "react";
import {
    Button,
    TextField,
    Typography,
    MenuItem,
    Select,
    FormControl,
} from "@mui/material";
import * as XLSX from "xlsx";
import { sheetIdDefault } from "../config/config"

export default function SetupComponent({ onSetupComplete }) {
    const [dataSource, setDataSource] = useState("google");
    const [excelData, setExcelData] = useState([]);
    const [sheetId, setSheetId] = useState(sheetIdDefault);
    const [tavoloCorrente, setTavoloCorrente] = useState("");
    const [availableTables, setAvailableTables] = useState([]);

    // --- Carica Excel locale ---
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const data = new Uint8Array(evt.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet) || [];
                setExcelData(jsonData);
            } catch (err) {
                console.error("Errore durante la lettura del file Excel:", err);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    // --- Recupero dati Google Sheets ---
    const fetchGoogleSheet = async () => {
        if (!sheetId) return;
        try {
            const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
            const res = await fetch(url);
            const text = await res.text();
            const json = JSON.parse(
                text.substring(text.indexOf("(") + 1, text.lastIndexOf(")"))
            );
            const rows = json.table.rows;
            const data = rows.map((row) => {
                const obj = {};
                json.table.cols.forEach((col, idx) => {
                    obj[col.label] = row.c[idx]?.v || "";
                });
                return obj;
            });
            setExcelData(data);
        } catch (err) {
            console.error("Errore fetch Google Sheet:", err);
        }
    };

    // --- Estrarre lista tavoli disponibili ---
    useEffect(() => {
        if (excelData.length) {
            const tables = Array.from(
                new Set(
                    excelData
                        .map((row) => row.Tavolo)
                        .filter((t) => t !== undefined && t !== null && t !== "")
                )
            ).sort((a, b) => a - b);
            setAvailableTables(tables);
            setTavoloCorrente(""); // reset selezione
        }
    }, [excelData]);

    // --- Conferma configurazione ---
    const handleConfirm = () => {
        if (tavoloCorrente && excelData.length) {
            onSetupComplete({ excelData, tavoloCorrente });
        }
    };

    // Funzione per cambiare la sorgente dati
    const handleDataSourceChange = (value) => {
        setDataSource(value);
        setExcelData([]);         // reset dati caricati
        setTavoloCorrente("");    // reset selezione tavolo
        setAvailableTables([]);   // reset lista tavoli
    };

    return (
        <div>
            {!dataSource ? (
                <>
                    <Typography variant="body1" gutterBottom>
                        Seleziona la sorgente dati:
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <Select
                            value={dataSource}
                            onChange={(e) => handleDataSourceChange(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="local">Excel Locale</MenuItem>
                            <MenuItem value="google">Google Sheets</MenuItem>
                        </Select>
                    </FormControl>
                </>
            ) : !excelData.length ? (
                <>
                    <Typography variant="body1" gutterBottom>
                        Seleziona la sorgente dati:
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <Select
                            value={dataSource}
                            onChange={(e) => handleDataSourceChange(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="local">Excel Locale</MenuItem>
                            <MenuItem value="google">Google Sheets</MenuItem>
                        </Select>
                    </FormControl>
                    {dataSource === "local" ? (
                        <>
                            <Typography variant="body1" gutterBottom>
                                Carica il file Excel con Nome, Cognome e Tavolo:
                            </Typography>
                            <Button variant="contained" component="label" fullWidth>
                                Scegli File Excel
                                <input
                                    type="file"
                                    hidden
                                    accept=".xlsx, .xls"
                                    onChange={handleFileUpload}
                                />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography variant="body1" gutterBottom>
                                Inserisci ID del Google Sheet:
                            </Typography>
                            <TextField
                                label="Google Sheet ID"
                                fullWidth
                                sx={{ mb: 2 }}
                                value={sheetId}
                                onChange={(e) => setSheetId(e.target.value)}
                            />
                            <Button variant="contained" fullWidth onClick={fetchGoogleSheet}>
                                Carica da Google Sheets
                            </Button>
                        </>
                    )}
                </>
            ) : (
                <>
                    <Typography variant="body1" gutterBottom>
                        Seleziona il tavolo corrente:
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <Select
                            value={tavoloCorrente}
                            onChange={(e) => setTavoloCorrente(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Seleziona tavolo
                            </MenuItem>
                            {availableTables.map((t) => (
                                <MenuItem key={t} value={t}>
                                    {t}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button variant="contained" fullWidth onClick={handleConfirm}>
                        Conferma Tavolo
                    </Button>
                </>
            )}
        </div>
    );
}
