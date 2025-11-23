import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Screen, DifficultyLevel, GameStats, Room, Clue } from '../types';

interface GameContextType {
    screen: Screen;
    setScreen: (screen: Screen) => void;
    difficulty: DifficultyLevel | null;
    setDifficulty: (difficulty: DifficultyLevel) => void;
    currentRoomIndex: number;
    setCurrentRoomIndex: (index: number) => void;
    completedRooms: number[];
    completeRoom: (roomId: number) => void;
    gameStats: GameStats;
    updateStats: (stats: Partial<GameStats>) => void;
    resetGame: () => void;
    quitGame: () => void;
    currentRooms: Room[];
    setCurrentRooms: (rooms: Room[]) => void;
    unlockedCluesHistory: Record<number, Clue[]>;
    setRoomClues: (roomId: number, clues: Clue[]) => void;
    isMuted: boolean;
    toggleMute: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialState = {
    screen: Screen.MainMenu,
    difficulty: null,
    currentRoomIndex: 0,
    completedRooms: [],
    gameStats: {
        totalTime: 0,
        cluesUsed: 0,
        correctAttempts: 0,
        wrongAttempts: 0,
    },
    currentRooms: [],
    unlockedCluesHistory: {},
    isMuted: false,
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [screen, setScreen] = useState<Screen>(initialState.screen);
    const [difficulty, setDifficultyState] = useState<DifficultyLevel | null>(initialState.difficulty);
    const [currentRoomIndex, setCurrentRoomIndex] = useState<number>(initialState.currentRoomIndex);
    const [completedRooms, setCompletedRooms] = useState<number[]>(initialState.completedRooms);
    const [gameStats, setGameStats] = useState<GameStats>(initialState.gameStats);
    const [currentRooms, setCurrentRooms] = useState<Room[]>(initialState.currentRooms);
    const [unlockedCluesHistory, setUnlockedCluesHistory] = useState<Record<number, Clue[]>>(initialState.unlockedCluesHistory);
    const [isMuted, setIsMuted] = useState<boolean>(initialState.isMuted);

    const setDifficulty = (level: DifficultyLevel) => {
        setDifficultyState(level);
        setScreen(Screen.ElementRandomization);
    };

    const completeRoom = (roomId: number) => {
        setCompletedRooms(prev => [...new Set([...prev, roomId])]);
    };
    
    const updateStats = useCallback((stats: Partial<GameStats>) => {
        setGameStats(prev => ({...prev, ...stats}));
    }, []);

    const setRoomClues = (roomId: number, clues: Clue[]) => {
        setUnlockedCluesHistory(prev => ({...prev, [roomId]: clues}));
    }

    const resetGame = () => {
        setDifficultyState(initialState.difficulty);
        setCurrentRoomIndex(initialState.currentRoomIndex);
        setCompletedRooms(initialState.completedRooms);
        setGameStats(initialState.gameStats);
        setCurrentRooms(initialState.currentRooms);
        setUnlockedCluesHistory(initialState.unlockedCluesHistory);
        setScreen(Screen.DifficultySelection);
    }

    const quitGame = () => {
        setDifficultyState(initialState.difficulty);
        setCurrentRoomIndex(initialState.currentRoomIndex);
        setCompletedRooms(initialState.completedRooms);
        setGameStats(initialState.gameStats);
        setCurrentRooms(initialState.currentRooms);
        setUnlockedCluesHistory(initialState.unlockedCluesHistory);
        setScreen(Screen.MainMenu);
    }

    const toggleMute = () => setIsMuted(prev => !prev);

    return (
        <GameContext.Provider value={{ 
            screen, setScreen, 
            difficulty, setDifficulty,
            currentRoomIndex, setCurrentRoomIndex,
            completedRooms, completeRoom,
            gameStats, updateStats,
            resetGame,
            quitGame,
            currentRooms, setCurrentRooms,
            unlockedCluesHistory, setRoomClues,
            isMuted, toggleMute,
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};