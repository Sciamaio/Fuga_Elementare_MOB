
import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

const SoundManager: React.FC = () => {
    const { isMuted } = useGame();
    const audioRef = useRef<HTMLAudioElement>(null);

    // Set initial volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.4;
        }
    }, []);

    // Try to play music after the first user interaction
    useEffect(() => {
        const playAudio = () => {
            if (audioRef.current) {
                // Only play if not muted and currently paused
                if (!isMuted && audioRef.current.paused) {
                    const playPromise = audioRef.current.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.warn("Audio playback prevented by browser:", error);
                        });
                    }
                }
            }
        };

        const handleInteraction = () => {
            playAudio();
        };

        // Browsers block audio until user interacts
        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction);

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, [isMuted]);

    // Sync muted state directly
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
            if (!isMuted && audioRef.current.paused) {
                 // Try to resume if unmuted
                 audioRef.current.play().catch(() => {});
            }
        }
    }, [isMuted]);

    // Using a more reliable, direct MP3 link for ambient synthwave music
    const musicSrc = 'https://cdn.pixabay.com/download/audio/2022/03/23/audio_07967931a8.mp3';

    return (
        <audio ref={audioRef} loop playsInline>
            <source src={musicSrc} type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>
    );
};

export default SoundManager;