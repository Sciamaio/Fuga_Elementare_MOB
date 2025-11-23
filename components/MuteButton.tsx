import React from 'react';
import { useGame } from '../context/GameContext';
import { SpeakerOnIcon, SpeakerOffIcon } from './icons';

const MuteButton: React.FC = () => {
    const { isMuted, toggleMute } = useGame();

    return (
        <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 z-50 p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/80 text-cyan-300 hover:text-white transition-all border border-slate-600 hover:border-cyan-400 shadow-lg"
            aria-label={isMuted ? "Unmute sound" : "Mute sound"}
        >
            {isMuted ? <SpeakerOffIcon className="w-6 h-6" /> : <SpeakerOnIcon className="w-6 h-6" />}
        </button>
    );
};

export default MuteButton;