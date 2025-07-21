import { NavigationEvents } from "@/app/_components/NavigationEvents";
import { Suspense } from 'react';

export default function FrontendLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
            <Suspense fallback={null}>
                <NavigationEvents />
            </Suspense>
        </>
    )
}


