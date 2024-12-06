import {getUser,getToken} from "../utils";
import Survey from "./Survey"

import React, { useState } from "react";
import Navbar from "../dashboard/Navbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppBar } from "@mui/material";
import HealthFitnessScreenLWGM from "./HealthFitnessScreenLWGM"


const Nutrition = () => {
    const user = getUser()
    const isCompeleted = user.completedSurvey
    console.log(isCompeleted)

    const theme = createTheme({
        palette: {
            primary: {
                main: "#1976d2",
            },
        },
    });






    return(
        <ThemeProvider theme={theme}>
            <AppBar position="static" className="bg-blue-600">
                <Navbar />
            </AppBar>
            {!isCompeleted ? (
                <Survey></Survey>
                    ) : (
                    <HealthFitnessScreenLWGM></HealthFitnessScreenLWGM>
                    )
                }
                </ThemeProvider>
    )


}

export default Nutrition;
