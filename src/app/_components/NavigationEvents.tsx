'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'

export function NavigationEvents() {
    const params = useParams<{ id: string; }>()

    useEffect(() => {
        const { id }: { id: string | null } = params;

        if (!id) {
            document.body.classList.remove("bg-dots");
        }
    }, [params])

    return null;
}
