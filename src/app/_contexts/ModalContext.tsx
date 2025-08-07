"use client";

import React, { createContext, useContext, useState } from 'react';

interface IModalContext {
    setIsModalOpen: (value: boolean) => void;
    isModalOpen: boolean;
}

const ModalContext = createContext<IModalContext>({
    setIsModalOpen: () => { },
    isModalOpen: false,
});

export const ModalProvider = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <ModalContext value={{ isModalOpen, setIsModalOpen }}>
            {children}
        </ModalContext>
    );
};

export const useModal = () => useContext<IModalContext>(ModalContext);
