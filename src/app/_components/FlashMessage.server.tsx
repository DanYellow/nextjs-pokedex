"use server"

import { cookies } from 'next/headers'


const FlashMessage = async () => {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('flash_message')?.value;

    if (cookie) {
        return (
            <div className='bg-red-200 text-red-800 px-2 py-1.5 rounded-xl mb-4'>
                <p>Veuillez vous connecter</p>
            </div>
        )
    }

    return null;
}

export default FlashMessage;
