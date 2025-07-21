"use client";
import { useSearchParams } from 'next/navigation';
import { redirect } from 'next/navigation'


import { MAX_GENERATION } from "@/app/_utils";
import { DM_Sans } from 'next/font/google';

const DMSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
});

export default () => {
    const searchParams = useSearchParams()

    return (
        <select className={`${DMSans.variable} text-black`} onChange={(e) => {
            redirect(`/?id=${e.target.value}`)
        }} defaultValue={searchParams.get('id') || "1"}
        >
            {Array.from({ length: MAX_GENERATION }).map((_, idx) => {
                return (
                    <option className={`${DMSans.variable} text-black`} value={idx + 1} key={idx + 1}>#{idx + 1}</option>
                )
            })}
        </select>
    )
}
