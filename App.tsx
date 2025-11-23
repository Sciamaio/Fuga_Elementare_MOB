import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import MainMenu from './components/MainMenu';
import DifficultySelection from './components/DifficultySelection';
import LabMap from './components/LabMap';
import GameScreen from './components/GameScreen';
import VictoryScreen from './components/VictoryScreen';
import { Screen } from './types';
import ElementRandomizer from './components/ElementRandomizer';
import SoundManager from './components/SoundManager';
import MuteButton from './components/MuteButton';

const AppContent: React.FC = () => {
    const { screen } = useGame();

    const renderScreen = () => {
        switch (screen) {
            case Screen.MainMenu:
                return <MainMenu />;
            case Screen.DifficultySelection:
                return <DifficultySelection />;
            case Screen.ElementRandomization:
                return <ElementRandomizer />;
            case Screen.LabMap:
                return <LabMap />;
            case Screen.Game:
                return <GameScreen />;
            case Screen.Victory:
                return <VictoryScreen />;
            default:
                return <MainMenu />;
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen w-full flex items-center justify-center md:p-4 p-0 overflow-hidden">
            <SoundManager />
            
            {/* Orientation Blocker for Mobile */}
            <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center text-center p-8 md:hidden landscape:flex hidden">
                <div className="animate-spin mb-8">
                    <svg className="w-16 h-16 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </div>
                <h2 className="font-orbitron text-2xl text-red-500 font-bold mb-4">ROTAZIONE RILEVATA</h2>
                <p className="text-slate-300">Per favore, ruota il dispositivo in verticale per accedere ai sistemi del laboratorio.</p>
            </div>

            {/* Main Container - Full height on mobile (dvh), constrained on desktop */}
            <div className="w-full max-w-7xl h-[100dvh] md:h-[90vh] max-h-[1000px] bg-slate-900 border-0 md:border-2 border-cyan-500/30 md:rounded-lg shadow-none md:shadow-2xl shadow-cyan-500/10 flex flex-col overflow-hidden relative">
                <MuteButton />
                {renderScreen()}
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <GameProvider>
            <AppContent />
        </GameProvider>
    );
};

export default App;