import React from 'react';
import { useGame } from '../context/GameContext';
import { Screen } from '../types';
import { AtomIcon, BoarIcon } from './icons';

const MainMenu: React.FC = () => {
    const { setScreen } = useGame();

    return (
        <div className="flex flex-col items-center justify-center h-full bg-grid-cyan-500/10 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-900"></div>
            <div className="relative z-10 flex flex-col items-center w-full h-full">
                <div className="flex-1 flex flex-col items-center justify-center">
                    <AtomIcon className="w-24 h-24 text-cyan-400 animate-pulse-slow mb-4" />
                    <h1 className="font-orbitron text-6xl md:text-8xl font-black text-white uppercase tracking-widest text-shadow-neon-cyan">
                        CHEMSCAPE
                    </h1>
                    <p className="font-orbitron text-2xl md:text-3xl text-cyan-300 mt-2 text-shadow-neon-cyan-sm">
                        Fuga Elementare
                    </p>
                    <div className="mt-12 space-y-4 w-64">
                        <button 
                            onClick={() => setScreen(Screen.DifficultySelection)}
                            className="w-full bg-cyan-500 text-slate-900 font-bold py-3 px-6 rounded-lg text-lg uppercase tracking-wider font-orbitron transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-400/50 transform hover:-translate-y-1"
                        >
                            Nuova Partita
                        </button>
                    </div>
                </div>
                 <div className="flex items-center gap-2 text-cyan-300/80 text-lg absolute bottom-8 right-8 italic text-shadow-neon-cyan-sm">
                    <BoarIcon className="w-8 h-8" />
                    <span>by SciaMaio</span>
                </div>
            </div>
        </div>
    );
};

export default MainMenu;