
import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { generateGameRooms } from '../utils/gameSetup';
import { ELEMENTS } from '../data/elements';
import { Screen } from '../types';

const ElementRandomizer: React.FC = () => {
    const { difficulty, setCurrentRooms, setScreen } = useGame();
    const [displayedSymbols, setDisplayedSymbols] = useState<string[]>([]);
    
    useEffect(() => {
        if (!difficulty) return;

        // Start the animation
        const intervalId = setInterval(() => {
            const randomSymbols = [...Array(8)].map(() => {
                const randomIndex = Math.floor(Math.random() * ELEMENTS.length);
                return ELEMENTS[randomIndex].symbol;
            });
            setDisplayedSymbols(randomSymbols);
        }, 100);

        // After animation duration, generate rooms and transition
        const timerId = setTimeout(() => {
            clearInterval(intervalId);
            const newRooms = generateGameRooms(difficulty);
            setCurrentRooms(newRooms);
            setScreen(Screen.LabMap);
        }, 3000); // 3-second animation

        return () => {
            clearInterval(intervalId);
            clearTimeout(timerId);
        };
    }, [difficulty, setCurrentRooms, setScreen]);


    return (
        <div className="flex flex-col items-center justify-center h-full bg-grid-cyan-500/10 p-4 md:p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-900"></div>
            <div className="relative z-10">
                 <h1 className="font-orbitron text-3xl md:text-5xl font-black text-white uppercase tracking-widest text-shadow-neon-cyan">
                    Configurazione Missione
                </h1>
                 <p className="font-orbitron text-lg md:text-2xl text-cyan-300 mt-2 text-shadow-neon-cyan-sm animate-pulse">
                    Selezione elementi...
                </p>

                <div className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    { (displayedSymbols.length > 0 ? displayedSymbols : Array(8).fill('?')).map((symbol, index) => (
                        <div key={index} className="w-20 h-20 md:w-24 md:h-24 bg-slate-800/50 border-2 border-slate-700 rounded-lg flex items-center justify-center">
                            <span className="font-orbitron text-3xl md:text-4xl font-bold text-cyan-400">{symbol}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ElementRandomizer;