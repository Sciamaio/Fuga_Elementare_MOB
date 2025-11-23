
import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { TrophyIcon, MedalIcon, AtomIcon, MicroscopeIcon, FlaskIcon, ListIcon, ScrollIcon, XIcon } from './icons';
import { Clue } from '../types';

const VictoryScreen: React.FC = () => {
    const { gameStats, difficulty, resetGame, quitGame, unlockedCluesHistory, currentRooms } = useGame();
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    // Calculate Score
    const calculateScore = () => {
        let score = 100;
        
        // 5 points per wrong attempt
        const wrongAttemptsPenalty = gameStats.wrongAttempts * 5;
        score -= wrongAttemptsPenalty;

        // Cost of unlocked clues based on the cost property assigned during game
        let totalClueCost = 0;
        (Object.values(unlockedCluesHistory) as Clue[][]).forEach(clues => {
            clues.forEach(clue => {
                totalClueCost += (clue.cost || 0);
            });
        });
        
        score -= totalClueCost;

        return Math.max(0, score);
    };

    const score = calculateScore();

    // Determine Badge
    const getBadge = (score: number) => {
        if (score >= 100) return { title: "Novello Mendeleev", icon: TrophyIcon, color: "text-yellow-400" };
        if (score >= 90) return { title: "Grandioso... ad un passo dai giganti", icon: MedalIcon, color: "text-slate-300" };
        if (score >= 75) return { title: "Bene così gli elementi hanno pochi segreti per te", icon: MicroscopeIcon, color: "text-amber-600" };
        if (score >= 60) return { title: "Ancora qualche sforzo per ricevere i complimenti", icon: FlaskIcon, color: "text-cyan-400" };
        return { title: "Non è il caso di esultare, ma almeno ce l'hai fatta!", icon: AtomIcon, color: "text-red-500" };
    };

    const badge = getBadge(score);
    const BadgeIcon = badge.icon;

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-grid-green-500/10 relative w-full">
             <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-900"></div>
            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
                <h1 className="font-orbitron text-6xl md:text-7xl font-black text-green-400 uppercase tracking-widest text-shadow-neon-green mb-6">
                    Fuga Riuscita!
                </h1>

                <div className="flex flex-col items-center mb-8">
                    <div className={`p-6 rounded-full bg-slate-800 border-4 border-slate-700 mb-4 shadow-2xl shadow-${badge.color.split('-')[1]}-500/20`}>
                        <BadgeIcon className={`w-24 h-24 ${badge.color}`} />
                    </div>
                    <h2 className={`text-4xl font-orbitron font-bold ${badge.color} mb-2`}>{score} Punti</h2>
                    <p className="text-xl font-orbitron text-white uppercase tracking-wider">{badge.title}</p>
                </div>

                <div className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-8">
                    <div>
                        <p className="text-slate-400 text-sm uppercase">Livello</p>
                        <p className="text-white font-bold text-xl uppercase tracking-wider text-cyan-300">{difficulty}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm uppercase">Tempo Totale</p>
                        <p className="text-white font-bold text-xl">{gameStats.totalTime}s</p>
                    </div>
                     <div>
                        <p className="text-slate-400 text-sm uppercase">Errori / Penalità</p>
                        <p className="text-red-400 font-bold text-xl">{gameStats.wrongAttempts} <span className="text-xs text-slate-500">(-{gameStats.wrongAttempts * 5} pt)</span></p>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                     <button 
                        onClick={resetGame}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg text-lg uppercase tracking-wider font-orbitron transition-all shadow-lg shadow-cyan-500/20 transform hover:-translate-y-1"
                    >
                        Gioca Ancora
                    </button>
                    <button 
                        onClick={() => setIsReviewOpen(true)}
                        className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-lg text-lg uppercase tracking-wider font-orbitron transition-all shadow-lg transform hover:-translate-y-1 flex items-center gap-2"
                    >
                        <ListIcon className="w-6 h-6" />
                        Rivedi Missione
                    </button>
                    <button 
                        onClick={quitGame}
                        className="bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-slate-900 font-bold py-3 px-8 rounded-lg text-lg uppercase tracking-wider font-orbitron transition-all shadow-lg transform hover:-translate-y-1"
                    >
                        Menu
                    </button>
                </div>
            </div>

            {/* Review Modal */}
            {isReviewOpen && (
                <div className="absolute inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-slate-900 border-2 border-cyan-500 rounded-lg w-full max-w-5xl h-[90%] flex flex-col shadow-2xl relative">
                        <div className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-800/50 shrink-0">
                            <h3 className="text-2xl font-orbitron text-cyan-300 flex items-center gap-3">
                                <ScrollIcon className="w-8 h-8" />
                                Rapporto Missione
                            </h3>
                            <button onClick={() => setIsReviewOpen(false)} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-full">
                                <XIcon className="w-8 h-8" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {currentRooms.map((room, index) => (
                                <div key={room.id} className="bg-slate-800/80 rounded-lg p-6 border border-slate-700 shadow-md">
                                    <div className="flex justify-between items-start mb-4 border-b border-slate-700 pb-4">
                                        <div>
                                            <h4 className="text-lg font-bold text-orange-400 uppercase tracking-wide">Stanza {room.id}: {room.group}</h4>
                                            <p className="text-sm text-slate-400 italic">{room.theme}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-4xl font-orbitron font-bold text-cyan-400 block">{room.element?.symbol || '?'}</span>
                                            <span className="text-white font-bold text-lg">{room.element?.name || 'Sconosciuto'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs mb-3 uppercase tracking-widest font-bold">Indizi Utilizzati</p>
                                        <ul className="space-y-2">
                                            {(unlockedCluesHistory[room.id] && unlockedCluesHistory[room.id].length > 0) ? (
                                                unlockedCluesHistory[room.id].map((clue, idx) => (
                                                    <li key={idx} className="text-slate-300 bg-slate-900/50 p-3 rounded border-l-4 border-cyan-500 text-sm flex justify-between items-center">
                                                        <span className="italic">"{clue.text}"</span>
                                                        <div className="flex items-center gap-2 ml-4 shrink-0">
                                                             <span className="text-xs text-red-400 font-bold bg-black/40 px-2 py-1 rounded whitespace-nowrap">-{clue.cost} pt</span>
                                                             <span className="text-xs text-slate-500 uppercase bg-black/20 px-2 py-1 rounded whitespace-nowrap">{clue.type}</span>
                                                        </div>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-green-400 italic text-sm bg-green-900/20 p-3 rounded border-l-4 border-green-500">
                                                    Risolto senza indizi extra!
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VictoryScreen;
