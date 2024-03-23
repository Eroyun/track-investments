import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import login from '../assets/login.png';

const NavBar = ({ handleLogin }) => {
    const theme = useTheme();

    return (
        <AppBar position="static" sx={{ background: theme.palette.secondary.main }}>
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        flexGrow: 1,
                        fontFamily: '"Segoe UI Emoji"',
                        fontWeight: 700,
                        color: theme.palette.white.main
                    }}
                >
                    OneStopInvestor
                </Typography>
                <Button color="inherit" onClick={handleLogin}>
                    <Image
                        src={login}
                        alt="Login"
                        width={40}
                        height={40}
                        layout="fixed"
                    />
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
