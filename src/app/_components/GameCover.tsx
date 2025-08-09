"use client";

import Image from "next/image";

const GameCover = ({ src, alt }: { src: string, alt: string }) => {
    const replaceImgWithError = e => {
        console.log("fefefee")
    // e.currentTarget.onerror = null;
    // e.currentTarget.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/132.png';
  };
    
    return (
        <img 
            src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1322.png"}
            alt={alt}
            className="w-full"
            onError={replaceImgWithError}
        />
        // <Image
        //     width={200}
        //     height={200}
        //     src={src}
        //     alt={alt}
        //     className="w-full"
        //     onError={replaceImgWithError}
        // />
    );
};

export default GameCover;
