import React from 'react';
import { useGame } from '../context/GameContext';
import { DifficultyLevel, DIFFICULTY_SETTINGS } from '../types';
import { TriangleIcon, TetrahedronIcon, IcosahedronIcon, TrophyIcon } from './icons';

const ICONS: { [key: string]: React.FC<{className: string}> } = {
    'triangle': TriangleIcon,
    'tetrahedron': TetrahedronIcon,
    'icosahedron': IcosahedronIcon,
};

const COLORS: Record<DifficultyLevel, string> = {
    [DifficultyLevel.Facile]: 'text-green-400',
    [DifficultyLevel.Intermedio]: 'text-yellow-400',
    [DifficultyLevel.Difficile]: 'text-red-500',
};

const DifficultySelection: React.FC = () => {
    const { setDifficulty } = useGame();

    const handleSelect = (level: DifficultyLevel) => {
        setDifficulty(level);
    };

    return (
        <div className="flex flex-col items-center h-full p-4 md:p-8 overflow-y-auto custom-scrollbar">
            <h2 className="font-orbitron text-2xl md:text-4xl font-bold text-cyan-300 mb-4 md:mb-8 text-center mt-4 md:mt-0">Seleziona Difficoltà</h2>
            
            <div className="flex-1 flex flex-col items-center w-full max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full mb-8">
                    {(Object.keys(DIFFICULTY_SETTINGS) as DifficultyLevel[]).map(level => {
                        const setting = DIFFICULTY_SETTINGS[level];
                        const Icon = ICONS[setting.icon];
                        const color = COLORS[level];
                        const elementCount = level === DifficultyLevel.Facile ? 56 : 94;
                        
                        return (
                            <div 
                                key={level} 
                                onClick={() => handleSelect(level)}
                                className="bg-slate-800/50 p-4 md:p-8 rounded-lg border-2 border-slate-700 cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:bg-slate-800 active:scale-95 group flex flex-row md:flex-col items-center gap-4 md:gap-0"
                            >
                                <div className="flex items-center justify-center md:mb-6 shrink-0">
                                    <Icon className={`w-16 h-16 md:w-24 md:h-24 ${color} transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`} />
                                </div>
                                <div className="flex flex-col md:items-center text-left md:text-center flex-1">
                                    <h3 className={`text-xl md:text-3xl font-bold font-orbitron ${color} mb-1 md:mb-4 uppercase`}>{level}</h3>
                                    <div className="text-slate-300 text-sm md:text-lg leading-snug md:leading-relaxed">
                                        <p className="font-bold text-white">Tempo: {setting.time / 60} min</p>
                                        <p className="text-xs md:text-sm mb-1 md:mb-2">Tentativi illimitati</p>
                                        <p className="text-xs md:text-sm font-bold text-cyan-400 border border-cyan-500/30 rounded px-2 py-1 inline-block bg-cyan-900/20">
                                            Pool: {elementCount} Elementi
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="w-full bg-slate-900/60 border border-slate-700 rounded-xl p-4 md:p-6 shadow-lg mb-4 md:mb-0">
                    <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
                        <TrophyIcon className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
                        <h3 className="text-lg md:text-2xl font-orbitron font-bold text-white uppercase tracking-wider">Regolamento</h3>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 md:gap-6">
                        <div className="bg-slate-800/50 p-2 md:p-4 rounded-lg border border-slate-700/50 flex flex-col items-center text-center">
                            <span className="text-green-400 font-bold text-xl md:text-3xl mb-1 md:mb-2">100 Pt</span>
                            <span className="text-white font-bold uppercase text-[10px] md:text-sm">Inizio</span>
                        </div>

                        <div className="bg-slate-800/50 p-2 md:p-4 rounded-lg border border-slate-700/50 flex flex-col items-center text-center">
                            <span className="text-red-400 font-bold text-xl md:text-3xl mb-1 md:mb-2">-5 Pt</span>
                            <span className="text-white font-bold uppercase text-[10px] md:text-sm">Errore</span>
                        </div>

                        <div className="bg-slate-800/50 p-2 md:p-4 rounded-lg border border-slate-700/50 flex flex-col items-center text-center">
                            <span className="text-orange-400 font-bold text-xl md:text-3xl mb-1 md:mb-2">Costi</span>
                            <div className="text-slate-400 text-[9px] md:text-xs leading-tight">
                                <p>Indizi: <span className="text-orange-300">-1,-2...</span></p>
                                <p>Info: <span className="text-red-400">-4/-5</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DifficultySelection;