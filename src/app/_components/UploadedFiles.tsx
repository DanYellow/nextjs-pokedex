"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';

const UploadedFiles = ({ data }: { data: string[] }) => {
    const { width } = useWindowSize();
    const [formattedData, setFormattedData] = useState<string[][] | []>([])

    useEffect(() => {
        const res = []
        let i = 0;
        let NB_COLS = 3;

        if (width >= 1024) {
            NB_COLS = 5;
        } else if (width >= 768) {
            NB_COLS = 4;
        }

        const NB_ITEMS_PER_COL = Math.ceil(data.length / NB_COLS);
        for (let index = 0; index < NB_COLS; index++) {
            const subArray = []
            for (let j = 0; j < NB_ITEMS_PER_COL; j++) {
                subArray.push(data?.[i]);
                i++;
            }
            res.push(subArray.filter(Boolean))
        }
        setFormattedData(res)
    }, [width])

    return (
        <ol className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-4">
            {formattedData.map((group, idx) => (
                <li className="flex flex-col items-center" key={idx}>
                    <ol className="flex flex-col gap-3 mb-4">
                        {group.map((item) => (
                            <li key={item}>
                                <Image
                                    width={250}
                                    height={250}
                                    src={item}
                                    alt={`jaquette de ${item}`}
                                />
                            </li>
                        ))}
                    </ol>
                </li>
            ))}
        </ol>
    )
}


export default UploadedFiles;
