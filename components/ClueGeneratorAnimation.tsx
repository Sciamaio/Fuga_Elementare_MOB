import React from 'react';
import { MagnifyingGlassIcon } from './icons';

const ClueGeneratorAnimation: React.FC = () => {
    return (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
            <style>
                {`
                @keyframes scan {
                    0% { transform: translate(10%, 10%) rotate(0deg) scale(1); }
                    25% { transform: translate(70%, 40%) rotate(10deg) scale(1.1); }
                    50% { transform: translate(20%, 80%) rotate(-10deg) scale(1); }
                    75% { transform: translate(60%, 20%) rotate(5deg) scale(1.1); }
                    100% { transform: translate(10%, 10%) rotate(0deg) scale(1); }
                }
                .scanner {
                    animation: scan 8s ease-in-out infinite;
                }
                `}
            </style>
            <div className="relative w-64 h-48">
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-5 gap-1">
                    {Array.from({ length: 40 }).map((_, i) => (
                        <div key={i} className="bg-slate-700/50 rounded-sm animate-pulse" style={{ animationDelay: `${i * 50}ms` }}></div>
                    ))}
                </div>
                <div className="absolute inset-0 scanner">
                    <MagnifyingGlassIcon className="w-20 h-20 text-cyan-400" />
                </div>
            </div>
            <p className="font-orbitron text-2xl text-cyan-300 mt-8 text-shadow-neon-cyan-sm animate-pulse">
                Analisi IA in corso...
            </p>
        </div>
    );
};

export default ClueGeneratorAnimation;
