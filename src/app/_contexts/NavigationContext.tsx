"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface INavigationContext {
    setPreviousURL: (value: string) => void;
    previousURL: string;
}

const NavigationContext = createContext<INavigationContext>({
    setPreviousURL: () => { },
    previousURL: "",
});

export const NavigationProvider = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    const [previousURL, setPreviousURL] = useState<string>("");

    return (
        <NavigationContext value={{ previousURL, setPreviousURL }}>
            {children}
        </NavigationContext>
    );
};

export const useNavigation = () => useContext<INavigationContext>(NavigationContext);
