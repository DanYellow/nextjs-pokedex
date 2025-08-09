"use client";

import Image from "next/image";
import { useState } from "react";

const ImageWithFallback = ({ src, alt, fallbackSrc = "/images/missing-cover.png", ...rest }: { src: string, alt: string, fallbackSrc?: string }) => {
    const [imageHasError, setImageHasError] = useState(false);

    return (
        <Image
            src={imageHasError ? fallbackSrc : src}
            alt={alt}
            onError={() => {
                if (imageHasError) {
                    return;
                }
                setImageHasError(true);
            }}
            {...rest}
        />
    );
};

export default ImageWithFallback;
