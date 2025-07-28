"use client";

import { useWavesurfer } from '@wavesurfer/react';
import { useCallback, useRef } from 'react';

const PokemonCry = ({ color, link }: { color: string; link: URL }) => {
    const hexaColor = window.getComputedStyle(document.body).getPropertyValue(color);
    const hexaLightColor = `lch(from ${hexaColor} calc(l + 35) c h)`;
    const hexaDarkColor = `lch(from ${hexaColor} calc(l - 35) c h)`;

    const playerRef = useRef<HTMLDivElement>(null);
    const { wavesurfer, isPlaying } = useWavesurfer({
        container: playerRef,
        height: 75,
        waveColor: hexaColor,
        progressColor: hexaLightColor,
        url: link.toString(),
    });

    const onPlayPause = useCallback(() => {
        wavesurfer && wavesurfer.playPause()
    }, [wavesurfer]);

    return (
        <div className="flex flex-row gap-4 items-center my-4 rounded-4xl px-5 py-2" style={{ backgroundColor: hexaDarkColor }}>
            <button className={`rounded-full p-5`} style={{ backgroundColor: hexaColor, color: hexaLightColor }} onClick={onPlayPause} type="button">
                {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                    </svg>
                )}
            </button>
            <div className='grow' ref={playerRef}></div>
        </div>
    )
}

export default PokemonCry
