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
        <div className="flex flex-col items-center justify-center h-full p-8 overflow-y-auto custom-scrollbar">
            <h2 className="font-orbitron text-4xl font-bold text-cyan-300 mb-2 text-center">Seleziona il Livello di Difficoltà</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 w-full max-w-5xl">
                {(Object.keys(DIFFICULTY_SETTINGS) as DifficultyLevel[]).map(level => {
                    const setting = DIFFICULTY_SETTINGS[level];
                    const Icon = ICONS[setting.icon];
                    const color = COLORS[level];
                    // Determine element count for display
                    const elementCount = level === DifficultyLevel.Facile ? 56 : 94;
                    
                    return (
                        <div 
                            key={level} 
                            onClick={() => handleSelect(level)}
                            className="bg-slate-800/50 p-8 rounded-lg border-2 border-slate-700 cursor-pointer transition-all duration-300 hover:border-cyan-400 hover:bg-slate-800 hover:scale-105 group flex flex-col items-center"
                        >
                            <div className="flex items-center justify-center mb-6">
                                <Icon className={`w-24 h-24 ${color} transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`} />
                            </div>
                            <h3 className={`text-3xl font-bold font-orbitron text-center ${color} mb-4 uppercase`}>{level}</h3>
                            <div className="text-slate-300 text-center text-lg leading-relaxed">
                                <p className="mb-2 font-bold text-white">Tempo: {setting.time / 60} minuti</p>
                                <p className="text-sm mb-2">Tentativi illimitati</p>
                                <p className="text-sm font-bold text-cyan-400 border border-cyan-500/30 rounded px-2 py-1 inline-block bg-cyan-900/20">
                                    Pool: {elementCount} Elementi
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-12 w-full max-w-5xl bg-slate-900/60 border border-slate-700 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <TrophyIcon className="w-8 h-8 text-yellow-400" />
                    <h3 className="text-2xl font-orbitron font-bold text-white uppercase tracking-wider">Regolamento Punteggio</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 flex flex-col items-center text-center">
                        <span className="text-green-400 font-bold text-3xl mb-2">100 Pt</span>
                        <span className="text-white font-bold uppercase text-sm mb-1">Punteggio Iniziale</span>
                        <p className="text-slate-400 text-xs">Mantieni il punteggio alto!</p>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 flex flex-col items-center text-center">
                        <span className="text-red-400 font-bold text-3xl mb-2">-5 Pt</span>
                        <span className="text-white font-bold uppercase text-sm mb-1">Penalità Errore</span>
                        <p className="text-slate-400 text-xs">Per ogni risposta sbagliata.</p>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 flex flex-col items-center text-center">
                        <span className="text-orange-400 font-bold text-3xl mb-2">Costo Indizi</span>
                        <span className="text-white font-bold uppercase text-sm mb-1">Progressivo</span>
                        <div className="text-slate-400 text-xs space-y-1 mt-1">
                            <p>1° Indizio: <span className="text-green-400">Gratis</span></p>
                            <p>Dal 2° in poi: <span className="text-orange-300">-1, -2, -3...</span></p>
                            <p>Simbolo/Z: <span className="text-red-400">-4/-5 Pt</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DifficultySelection;