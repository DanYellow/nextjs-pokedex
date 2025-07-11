"use client";

import React, { createContext, useContext, useState } from 'react';

// Create context
const LayoutContext = createContext({layout: "grid"});

// Create a provider component
export const LayoutProvider = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    const [layout, setLayout] = useState<string>("grid");

    return (
        <LayoutContext value={{ layout, setLayout }}>
            {children}
        </LayoutContext>
    );
};

// Custom hook to use the context
export const useLayout = () => useContext(LayoutContext);
