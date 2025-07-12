"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const LayoutContext = createContext<{ layout: string|null; setLayout: Function; }>({ layout: "grid", setLayout: () => {} });

// Create a provider component
export const LayoutProvider = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    const [layout, _setLayout] = useState<string|null>(null);

    useEffect(() => {
        const defaultLayout = localStorage.getItem("layout") ? localStorage.getItem("layout") as string : "grid";
        _setLayout(defaultLayout);
    }, [])

    const setLayout = (value: string) => {
        localStorage.setItem("layout", value);
        _setLayout(value);
    }

    return (
        <LayoutContext value={{ layout, setLayout }}>
            {children}
        </LayoutContext>
    );
};

// Custom hook to use the context
export const useLayout = () => useContext<{ layout: string|null; setLayout: Function }>(LayoutContext);
