import React from "react";
import { Box, Typography } from "@mui/material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";

export default function HeaderBar() {
    return (
        <Box
            sx={{
                width: "100%",
                height: 60,
                bgcolor: "#f57c00",
                display: "flex",
                alignItems: "center",
                position: "fixed",
                bottom: "84.5vh",
                left: 0,
                zIndex: 1001,
                justifyContent: "center",
                color: "#fff",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            }}
        >
            <RestaurantMenuIcon sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Table Manager
            </Typography>
        </Box>
    );
}
