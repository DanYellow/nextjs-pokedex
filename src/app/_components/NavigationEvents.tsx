'use client';

import { useEffect } from 'react'
import { useParams } from 'next/navigation'

declare namespace CSS {
    interface PropertyDefinition {
        name: string
        syntax?: string
        inherits: boolean
        initialValue?: string
    }

    namespace paintWorklet {
        export function addModule(url: string): void;
    }
    function registerProperty(propertyDefinition: PropertyDefinition): undefined
}


export function NavigationEvents() {
    const params = useParams<{ id: string; }>()

    useEffect(() => {
        const { id }: { id: string | null } = params;

        if (!id) {
            document.body.classList.remove("bg-dots");
        }
    }, [params])

    useEffect(() => {
        if ('paintWorklet' in window.CSS) {
            CSS.paintWorklet.addModule('./worklets/ripple.js');
        }
    }, []);

    return null;
}
