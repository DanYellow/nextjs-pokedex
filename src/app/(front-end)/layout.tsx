import { NavigationEvents } from "@/app/_components/NavigationEvents";
import { Suspense } from 'react';
import { NavigationProvider } from "@/app/_contexts/NavigationContext";
import { ModalProvider } from "@/app/_contexts/ModalContext";

export default function FrontendLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <ModalProvider>
                <NavigationProvider>
                    {children}
                    <Suspense fallback={null}>
                        <NavigationEvents />
                    </Suspense>
                </NavigationProvider>
            </ModalProvider>
        </>
    )
}


