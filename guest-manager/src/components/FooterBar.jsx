import React, {useState} from "react";
import { Box, Button } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import TapasIcon from '@mui/icons-material/Tapas';
import FlatwareIcon from '@mui/icons-material/Flatware';

export default function FooterBar({ whereA, setWhereA }) {

    return (
        <Box
            sx={{
                width: "100%",
                height: 50,
                bgcolor: "#f57c00",
                borderTop: "2px solid #f57c00",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                position: "fixed",
                bottom: 0,
                left: 0,
                zIndex: 1000,
                boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
            }}
        >
            <Button
                variant="contained"
                sx={{
                    bgcolor: "#f57c00",
                    "&:hover": { bgcolor: "#ef6c00", boxShadow: 0 },
                    width: "16.7vw",
                    height: 50,
                    borderRadius: 0,
                    boxShadow: 0,
                    borderRight: "2px solid #ef5c00",
                }}
            >
                <MenuBookIcon />
            </Button>
            <Button
                variant="contained"
                sx={{
                    bgcolor: "#f57c00",
                    "&:hover": { bgcolor: "#ef6c00", boxShadow: 0 },
                    width: "16.7vw",
                    height: 50,
                    borderRadius: 0,
                    boxShadow: 0,
                    borderRight: "2px solid #ef5c00",
                }}
            >
                <img src="/Logo_TG.png" alt="Logo_ACB" style={{ width:"0.8rem", height:"auto" }}/>
            </Button>
            <Button
                variant="contained"
                sx={{
                    bgcolor: "#f57c00",
                    "&:hover": { bgcolor: "#ef6c00", boxShadow: 0 },
                    width: "16.7vw",
                    height: 50,
                    borderRadius: 0,
                    boxShadow: 0,
                    borderRight: "2px solid #ef5c00",
                }}
            >
                <TableRestaurantIcon />
            </Button>
            <Button
                variant="contained"
                sx={{
                    bgcolor: "#f57c00",
                    "&:hover": { bgcolor: "#ef6c00", boxShadow: 0 },
                    width: "16.7vw",
                    height: 50,
                    borderRadius: 0,
                    boxShadow: 0,
                    borderRight: "2px solid #ef5c00",
                }}
            >
                <FlatwareIcon />
            </Button>
            <Button
                variant="contained"
                onClick={() => setWhereA(true)}
                sx={{
                    bgcolor: "#f57c00",
                    "&:hover": { bgcolor: "#ef6c00", boxShadow: 0 },
                    width: "16.7vw",
                    height: 50,
                    borderRadius: 0,
                    boxShadow: 0,
                    borderRight: "2px solid #ef5c00",
                }}
            >
                <img src="/Logo_ACB.png" alt="Logo_ACB" style={{ width:"3.8rem", height:"auto" }}/>
            </Button>
            <Button
                variant="contained"
                onClick={() => setWhereA(false)}
                sx={{
                    bgcolor: "#f57c00",
                    "&:hover": { bgcolor: "#ef6c00", boxShadow: 0 },
                    width: "16.7vw",
                    height: 50,
                    borderRadius: 0,
                    boxShadow: 0,
                    borderRight: "2px solid #ef5c00",
                }}
            >
                <img src="/Logo_DA.png" alt="Logo_ACB" style={{ width:"2.5rem", height:"auto" }}/>
            </Button>
        </Box>
    );
}
