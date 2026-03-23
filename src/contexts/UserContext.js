"use client";

import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [testResults, setTestResults] = useState(null);

    useEffect(() => {
        // Check if user is logged in from session storage
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('currentUser');
    };

    return (
        <UserContext.Provider value={{ user, login, logout, testResults, setTestResults }}>
            {children}
        </UserContext.Provider>
    );
};
