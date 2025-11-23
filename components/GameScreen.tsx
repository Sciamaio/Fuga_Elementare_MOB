
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Screen, DIFFICULTY_SETTINGS, DifficultyLevel, Clue } from '../types';
import useTimer from '../hooks/useTimer';
import { generateClues } from '../services/geminiService';
import OutcomeModal from './OutcomeModal';
import { ExitIcon, TrophyIcon, MagnifyingGlassIcon } from './icons';
import RoomDecorations from './RoomDecorations';
import ClueGeneratorAnimation from './ClueGeneratorAnimation';
import TimeUpModal from './TimeUpModal';
import AtomInputAnimation from './AtomInputAnimation';
import { playSound } from '../utils/soundEffects';

const getBackgroundStyle = (group: string): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        opacity: 0.05,
        backgroundColor: '#0d1117',
    };

    switch (group) {
        case "Sala Laboratorio":
            return { ...baseStyle, backgroundImage: 'radial-gradient(circle, #4a5568 1px, rgba(0,0,0,0) 1px)', backgroundSize: '25px 25px' };
        case "Biblioteca scientifica":
            return { ...baseStyle, backgroundImage: 'repeating-linear-gradient(45deg, #2d3748, #2d3748 10px, #4a5568 10px, #4a5568 20px)' };
        case "L'Enigma Finale":
            return { ...baseStyle, backgroundImage: 'repeating-linear-gradient(0deg, #00ffff, #00ffff 1px, transparent 1px, transparent 10px), repeating-linear-gradient(90deg, #00ffff, #00ffff 1px, transparent 1px, transparent 10px)', animation: 'pulse-bg 5s infinite' };
        default:
            return baseStyle;
    }
};

const GameScreen: React.FC = () => {
    const { 
        difficulty, 
        currentRoomIndex, 
        completeRoom, 
        setScreen, 
        updateStats, 
        gameStats, 
        currentRooms, 
        quitGame,
        completedRooms,
        unlockedCluesHistory,
        setRoomClues,
        resetGame,
        isMuted
    } = useGame();
    
    const [isLoading, setIsLoading] = useState(true);
    const [narrativeClues, setNarrativeClues] = useState<Clue[]>([]);
    const [unlockedClues, setUnlockedClues] = useState<Clue[]>([]);
    const [answer, setAnswer] = useState('');

    // Special Clues State
    const [isSymbolUnlocked, setIsSymbolUnlocked] = useState(false);
    const [isZUnlocked, setIsZUnlocked] = useState(false);

    const room = currentRooms[currentRoomIndex];
    const difficultySettings = difficulty ? DIFFICULTY_SETTINGS[difficulty] : DIFFICULTY_SETTINGS.FACILE;
    const isCompleted = completedRooms.includes(room?.id);
    
    const { time, start, stop } = useTimer(difficultySettings.time);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTimeUpModalOpen, setIsTimeUpModalOpen] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    
    // Scroll to bottom of console on new clue
    const consoleEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (consoleEndRef.current) {
            consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [unlockedClues, isLoading]);

    // Play initial sound when room loads (simulating monitor turning on)
    useEffect(() => {
        if (!isLoading) {
            playSound('click', isMuted);
        }
    }, [isLoading, isMuted]);


    // Calculate Current Score dynamically
    const calculateCurrentScore = () => {
        let score = 100;
        
        // Wrong attempts penalty (-5)
        score -= (gameStats.wrongAttempts * 5);

        // Clues penalty from history
        (Object.values(unlockedCluesHistory) as Clue[][]).forEach(roomClues => {
            roomClues.forEach(c => {
                score -= (c.cost || 0);
            });
        });
        
        // Current room penalty
        unlockedClues.forEach(c => {
            score -= (c.cost || 0);
        });

        return Math.max(0, score);
    };

    const currentScore = calculateCurrentScore();


    const loadClues = useCallback(async () => {
        if (!room || !difficulty || isCompleted) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setUnlockedClues([]);
        setNarrativeClues([]);
        setIsSymbolUnlocked(false);
        setIsZUnlocked(false);
        setAnswer('');
        try {
            // We don't pass a count limit for narrative clues anymore, we get a pool
            const fetchedClues = await generateClues(room.element.name, room.theme, 0, difficulty);
            setNarrativeClues(fetchedClues);
        } catch (error) {
            console.error("Failed to fetch clues:", error);
            setNarrativeClues([{ text: "Errore nel caricamento degli indizi. Riprova.", type: "Errore" }]);
        } finally {
            setIsLoading(false);
        }
    }, [room, difficulty, isCompleted]);

    useEffect(() => {
        loadClues();
    }, [loadClues]);
    
    // Timer always starts
    useEffect(() => {
        if (!isLoading && !isCompleted) {
            start();
        }
        return () => stop();
    }, [isLoading, isCompleted, start, stop]);

    useEffect(() => {
        if (time === 0 && !isCompleted) {
            stop();
            setIsTimeUpModalOpen(true);
        }
    }, [time, isCompleted, stop]);


    const handleUnlockNarrativeClue = (index: number) => {
        // Allow clicking any narrative clue that isn't unlocked yet
        const isUnlocked = unlockedClues.some(c => c.text === narrativeClues[index].text);
        if (isUnlocked) return;

        const narrativeUnlockedCount = unlockedClues.filter(c => !['Simbolo', 'Dati'].includes(c.type)).length;
        
        // First narrative clue is free (cost 0), then 1, 2, 3...
        const cost = narrativeUnlockedCount === 0 ? 0 : narrativeUnlockedCount;

        if (index < narrativeClues.length) {
            playSound('unlock', isMuted);
            const newClue = { ...narrativeClues[index], cost };
            setUnlockedClues(prev => [...prev, newClue]);
            updateStats({ cluesUsed: gameStats.cluesUsed + 1 });
        }
    };

    const handleUnlockSymbol = () => {
        if (isSymbolUnlocked) return;
        playSound('unlock', isMuted);
        const cost = 5;
        const clue: Clue = { text: `Simbolo Chimico: ${room.element.symbol}`, type: 'Simbolo', cost };
        setUnlockedClues(prev => [...prev, clue]);
        setIsSymbolUnlocked(true);
        updateStats({ cluesUsed: gameStats.cluesUsed + 1 });
    };

    const handleUnlockZ = () => {
        if (isZUnlocked) return;
        playSound('unlock', isMuted);
        const cost = difficulty === DifficultyLevel.Difficile ? 5 : 4;
        const clue: Clue = { text: `Numero Atomico: ${room.element.atomicNumber}`, type: 'Dati', cost };
        setUnlockedClues(prev => [...prev, clue]);
        setIsZUnlocked(true);
        updateStats({ cluesUsed: gameStats.cluesUsed + 1 });
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!answer.trim()) return;
        playSound('click', isMuted);

        if (answer.trim().toLowerCase() === room.element.name.toLowerCase()) {
            playSound('correct', isMuted);
            updateStats({ correctAttempts: gameStats.correctAttempts + 1 });
            setIsCorrect(true);
        } else {
            playSound('wrong', isMuted);
            updateStats({ wrongAttempts: gameStats.wrongAttempts + 1 });
            setIsCorrect(false);
        }
        setIsModalOpen(true);
    };

    const handleContinue = () => {
        setIsModalOpen(false);
        stop();
        completeRoom(room.id);
        
        // Save final state
        const finalClues = [...unlockedClues];
        setRoomClues(room.id, finalClues);

        if (completedRooms.length < currentRooms.length - 1) {
            setScreen(Screen.LabMap);
        } else {
            setScreen(Screen.Victory);
        }
        setAnswer('');
    };

    const handleTryAgain = () => {
        setIsModalOpen(false);
        setAnswer('');
    };

    // Failure logic isn't really reachable with infinite attempts, but keeps modal clean
    const handleFailure = () => {
        setIsModalOpen(false);
        stop();
        resetGame();
    };
    
    const handleTimeUpConfirm = () => {
        setIsTimeUpModalOpen(false);
        resetGame();
    };

    const timeColor = time <= 10 ? "text-red-500 animate-pulse" : "text-orange-400";
    const isSymbolAllowed = difficulty !== DifficultyLevel.Difficile;

    if (!room) {
        return <div className="flex items-center justify-center h-full">Caricamento Stanza...</div>
    }

    if (isCompleted) {
        const historyClues = unlockedCluesHistory[room.id] || [];
        
        return (
            <div className="flex flex-col h-full bg-slate-900 relative">
                <div style={getBackgroundStyle(room.group)}></div>
                <RoomDecorations group={room.group} />
                
                {/* Header for Review Mode */}
                <header className="flex justify-between items-center p-4 border-b-2 border-slate-700/50 bg-slate-800/20 z-10">
                     <div className="w-32 flex items-center gap-4">
                        <button 
                            onClick={() => setScreen(Screen.LabMap)} 
                            className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-2 group"
                        >
                            <ExitIcon className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
                            <span className="font-orbitron text-sm font-bold uppercase">Mappa</span>
                        </button>
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-orbitron text-green-400 uppercase tracking-wider font-bold">Stanza Completata</h2>
                        <p className="text-slate-400 text-xs font-orbitron tracking-widest uppercase">{room.group}</p>
                    </div>
                    <div className="w-32 text-right">
                    </div>
                </header>

                <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 overflow-y-auto custom-scrollbar">
                    <div className="bg-slate-800/90 border-2 border-green-500/30 rounded-xl p-8 max-w-4xl w-full shadow-2xl backdrop-blur-md relative overflow-hidden">
                        {/* Background accent */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-700 pb-6 mb-6 gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">Elemento Identificato</span>
                                </div>
                                <h1 className="text-5xl md:text-6xl font-orbitron font-black text-white text-shadow-neon-green leading-tight">
                                    {room.element.name}
                                </h1>
                            </div>
                            
                            <div className="flex gap-4 shrink-0">
                                <div className="flex flex-col items-center justify-center bg-slate-900/60 w-24 h-24 rounded-lg border border-slate-600 shadow-inner">
                                    <span className="text-[10px] text-slate-500 uppercase font-bold mb-1">Simbolo</span>
                                    <span className="text-4xl font-orbitron font-bold text-cyan-400">{room.element.symbol}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-900/60 w-24 h-24 rounded-lg border border-slate-600 shadow-inner">
                                    <span className="text-[10px] text-slate-500 uppercase font-bold mb-1">Numero Z</span>
                                    <span className="text-4xl font-orbitron font-bold text-orange-400">{room.element.atomicNumber}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/40 rounded-lg p-6 border border-slate-700/50">
                            <h3 className="text-lg font-orbitron text-cyan-300 mb-4 flex items-center gap-2 uppercase tracking-wider border-b border-slate-700/50 pb-2 w-fit">
                                <MagnifyingGlassIcon className="w-5 h-5" />
                                Indizi Decodificati
                            </h3>
                            
                            {historyClues.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                    {historyClues.map((clue, idx) => (
                                        <div key={idx} className="bg-slate-800/50 p-4 rounded border-l-4 border-cyan-500/50 flex justify-between items-start hover:bg-slate-800 transition-colors">
                                            <p className="text-slate-300 italic text-sm leading-relaxed">"{clue.text}"</p>
                                            <div className="flex flex-col items-end gap-1 ml-4 shrink-0">
                                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-black/30 px-2 py-1 rounded">{clue.type}</span>
                                                 <span className="text-[10px] font-bold text-red-400 bg-red-900/20 px-2 py-0.5 rounded">-{clue.cost} pt</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-8 border-2 border-dashed border-slate-700 rounded-lg">
                                    <p className="text-green-400 italic">Nessun indizio aggiuntivo utilizzato per risolvere questa stanza.</p>
                                    <p className="text-slate-500 text-sm mt-1">Prestazione eccellente!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-900 relative">
            <div style={getBackgroundStyle(room.group)}></div>
            <RoomDecorations group={room.group} />
            {/* Header */}
            <header className="flex justify-between items-center p-4 border-b-2 border-slate-700/50 bg-slate-800/20 z-10">
                <div className="w-32 flex items-center gap-4">
                    <button onClick={quitGame} className="text-slate-400 hover:text-cyan-300 transition-colors">
                        <ExitIcon className="w-8 h-8" />
                    </button>
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Punteggio</span>
                        <div className="flex items-center gap-1 text-green-400">
                             <TrophyIcon className="w-4 h-4" />
                             <span className="font-orbitron text-xl font-bold">{currentScore}</span>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-orbitron text-cyan-300">{`Stanza ${room.id} di ${currentRooms.length}: ${room.group}`}</h2>
                    <p className="font-orbitron text-xs text-orange-400 uppercase tracking-widest">{difficulty}</p>
                </div>
                <div className="text-3xl font-orbitron w-32 text-right flex justify-end items-baseline gap-1">
                     <span className={timeColor}>{time}</span>
                     <span className="text-sm text-slate-500 font-bold">s</span>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden z-10">
                {/* Clues Panel */}
                <aside className="w-1/4 p-4 border-r-2 border-slate-700/50 flex flex-col bg-slate-900/50 overflow-y-auto custom-scrollbar">
                    <h3 className="text-xl font-orbitron text-orange-400 mb-4">Pannello Indizi</h3>
                    <p className="mb-4 text-slate-400 text-sm">Sblocca indizi (costo in punti):</p>
                    
                    <div className="space-y-3">
                        {/* Narrative Clues */}
                        {narrativeClues.map((clue, i) => {
                             const isUnlocked = unlockedClues.some(c => c.text === clue.text);
                             
                             // Dynamic cost calculation for ANY button
                             const narrativeUnlockedCount = unlockedClues.filter(c => !['Simbolo', 'Dati'].includes(c.type)).length;
                             const currentCost = narrativeUnlockedCount === 0 ? 0 : narrativeUnlockedCount; 
                             
                             const displayCost = isUnlocked ? (unlockedClues.find(c => c.text === clue.text)?.cost) : currentCost;
                             const canUnlock = !isUnlocked; // Can unlock ANY locked clue now

                             return (
                                <button 
                                    key={i}
                                    onClick={() => handleUnlockNarrativeClue(i)}
                                    disabled={!canUnlock || isLoading}
                                    className={`w-full p-3 rounded text-left font-bold transition-all duration-200 border-l-4 flex justify-between items-center group ${
                                        isUnlocked ? 'bg-slate-700/50 text-slate-400 border-slate-500 cursor-default' :
                                        canUnlock ? 'bg-slate-800 hover:bg-slate-700 text-white border-orange-500 shadow-md hover:shadow-orange-500/20' :
                                        'bg-slate-900/50 text-slate-600 border-slate-800 cursor-not-allowed'
                                    }`}
                                >
                                    <div className="flex flex-col">
                                        <span>{`Indizio ${i+1}`}</span>
                                        {canUnlock && !isUnlocked && <span className="text-xs text-orange-300 font-normal">Costo: {displayCost === 0 ? 'Gratis' : `-${displayCost} pt`}</span>}
                                        {isUnlocked && <span className="text-xs text-slate-500 font-normal">Sbloccato (-{displayCost} pt)</span>}
                                    </div>
                                    <span className="text-xs uppercase tracking-wide opacity-70 bg-black/30 px-2 py-1 rounded">{clue.type}</span>
                                </button>
                             )
                        })}

                        <hr className="border-slate-700 my-4" />

                        {/* Special Clues */}
                         {isSymbolAllowed && (
                             <button
                                onClick={handleUnlockSymbol}
                                disabled={isSymbolUnlocked || isLoading}
                                className={`w-full p-3 rounded text-left font-bold transition-all duration-200 border-l-4 flex justify-between items-center ${
                                    isSymbolUnlocked ? 'bg-slate-700/50 text-slate-400 border-slate-500 cursor-default' :
                                    'bg-slate-800 hover:bg-slate-700 text-white border-purple-500 shadow-md hover:shadow-purple-500/20'
                                }`}
                            >
                                <div className="flex flex-col">
                                    <span>Simbolo Chimico</span>
                                    {!isSymbolUnlocked && <span className="text-xs text-red-400 font-normal">Costo: -5 pt</span>}
                                </div>
                                <span className="text-xs uppercase tracking-wide opacity-70 bg-black/30 px-2 py-1 rounded">Speciale</span>
                            </button>
                         )}

                        <button
                            onClick={handleUnlockZ}
                            disabled={isZUnlocked || isLoading}
                            className={`w-full p-3 rounded text-left font-bold transition-all duration-200 border-l-4 flex justify-between items-center ${
                                isZUnlocked ? 'bg-slate-700/50 text-slate-400 border-slate-500 cursor-default' :
                                'bg-slate-800 hover:bg-slate-700 text-white border-blue-500 shadow-md hover:shadow-blue-500/20'
                            }`}
                        >
                            <div className="flex flex-col">
                                <span>Numero Atomico</span>
                                {!isZUnlocked && <span className="text-xs text-red-400 font-normal">Costo: -{difficulty === DifficultyLevel.Difficile ? 5 : 4} pt</span>}
                            </div>
                            <span className="text-xs uppercase tracking-wide opacity-70 bg-black/30 px-2 py-1 rounded">Speciale</span>
                        </button>

                    </div>
                </aside>

                {/* Console - CRT Vintage Style */}
                <main className="flex-1 p-6 flex flex-col bg-black/20 relative">
                     {isLoading && <ClueGeneratorAnimation />}
                    
                    {/* CRT Monitor Container */}
                    <div className="flex-1 rounded-lg p-1 overflow-hidden relative border-4 border-gray-700 bg-black shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                         {/* CRT Screen Effect Overlay - Simple vignette, no lines for maximum readability */}
                         <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(circle,rgba(0,0,0,0)_50%,rgba(0,0,0,0.4)_100%)] rounded-lg"></div>

                        <div className="h-full bg-black rounded p-6 overflow-y-auto font-mono font-bold text-green-400 text-xl leading-relaxed tracking-wide custom-scrollbar relative z-10">
                            <div className="mb-4 opacity-70">
                                <span>{`> Connessione alla Stanza ${room.id}... Stabilita.`}</span>
                            </div>
                            
                            <div className="text-3xl text-red-500 font-bold my-4 border-b-2 border-red-500/50 pb-2 animate-pulse-slow">
                                {"> Elemento target: Sconosciuto. Tema: " + room.theme}
                            </div>
                            
                            {unlockedClues.map((clue, index) => {
                                 return (
                                     <div key={index} className="mb-4">
                                        <span className="mr-2 text-green-600 font-bold">{`> [${clue.type}] (Costo: ${clue.cost}):`}</span>
                                        <span className="text-yellow-300">
                                            <span>{`"${clue.text}"`}</span>
                                        </span>
                                     </div>
                                 )
                            })}
                            
                            <div ref={consoleEndRef} />

                            {!isLoading && unlockedClues.length === 0 && (
                                <p className="mt-4 animate-pulse text-slate-400">{"> In attesa di input. Scegli un indizio dal pannello laterale."}</p>
                            )}
                            
                            {!isLoading && unlockedClues.length > 0 && (
                                <p className="mt-6 text-cyan-400 border-t border-cyan-500/30 pt-2">
                                    {"> Inserisci il nome dell'elemento per sbloccare la porta..."}
                                    <span className="animate-pulse ml-1">_</span>
                                </p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            
            {/* Footer */}
            <footer className="p-4 border-t-2 border-slate-700/50 bg-slate-800/20 z-10">
                <form onSubmit={handleSubmit} className="flex items-center justify-between">
                     <div className="w-1/4">
                        <p className="text-slate-400">Tentativi: <span className="font-bold text-white">Illimitati</span></p>
                     </div>
                     <div className="flex-1 flex justify-center items-center gap-4">
                        <input 
                            type="text" 
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Inserisci il nome dell'elemento..."
                            className="bg-slate-900 border-2 border-slate-600 rounded-md py-2 px-4 text-white w-1/2 focus:outline-none focus:border-cyan-500"
                        />
                        <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-8 rounded-md font-orbitron uppercase">Invia</button>
                        <AtomInputAnimation />
                    </div>
                </form>
            </footer>

            <OutcomeModal
                isOpen={isModalOpen}
                isCorrect={isCorrect}
                attemptsLeft={null}
                onContinue={handleContinue}
                onTryAgain={handleTryAgain}
                onFailureConfirm={handleFailure}
            />

            <TimeUpModal
                isOpen={isTimeUpModalOpen}
                onConfirm={handleTimeUpConfirm}
            />
        </div>
    );
};

export default GameScreen;
