// AuthForm.js
import React from 'react';
import {login, register} from "../helpers/serverHelper";
import {useTheme} from '@mui/material/styles';

const AuthForm = ({isLogin, toggleIsLogin}) => {
    const theme = useTheme();

    const handleSubmit = async(event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password'),
            ...(isLogin
                ? {}
                : {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName')
                })
        };
        if (isLogin) {
            await login(data);
        } else {
            await register(data);
        }
    };
    return (
        <form
            id={isLogin
            ? "login"
            : "register"}
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 px-4 py-8 sm:px-16"
            style={{
            backgroundColor: theme.palette.white.main
        }}>

            <div style={{
                textAlign: 'center'
            }}>
                <span
                    style={{
                    color: theme.palette.primary.main,
                    fontFamily: 'OurCustomFont-Regular',
                    fontWeight: 'bold',
                    fontSize: '2rem',
                    display: 'block'
                }}>
                    {!isLogin
                        ? 'SIGN UP'
                        : 'LOG IN'}
                </span>
            </div>
            <div>
                <label htmlFor="email" className="block text-xs uppercase" style={{
                    color: theme.palette.black.main,
                }}>
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="user@example.com"
                    autoComplete="email"
                    required
                    style={{
                        marginTop: '0.5rem',
                        width: '100%',
                        appearance: 'none',
                        borderRadius: '4px',
                        border: `1px solid ${theme.palette.secondary.main}`,
                        padding: '0.75rem',
                        backgroundColor: theme.palette.white.main,
                        color: 'black', // Set the text color to black
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                        // Focus styles
                        outline: 'none',
                        '&:focus': {
                            borderColor: theme.palette.secondary.main,
                            boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                        },
                    }}
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-xs uppercase"style={{
                    color: theme.palette.black.main,
                }}>
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    style={{
                        marginTop: '0.5rem',
                        width: '100%',
                        appearance: 'none',
                        borderRadius: '4px',
                        border: `1px solid ${theme.palette.secondary.main}`,
                        padding: '0.75rem',
                        backgroundColor: theme.palette.white.main,
                        color: 'black', // Set the text color to black
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                        // Focus styles
                        outline: 'none',
                        '&:focus': {
                            borderColor: theme.palette.secondary.main,
                            boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                        },
                    }}
                />
            </div>
            <p className="text-center text-sm" style={{
                    color: theme.palette.black.main,
                }}>
                {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                <button
                    type="button"
                    onClick={toggleIsLogin}
                    className="font-semibold">
                    {isLogin
                        ? "Sign up"
                        : "Sign in"}
                </button>
                {isLogin
                    ? " for free."
                    : " instead."}
            </p>
        </form>
    );
};

export default AuthForm;