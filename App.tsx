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
        <div className="bg-gray-900 text-white min-h-screen w-full flex items-center justify-center p-4">
            <SoundManager />
            <div className="w-full max-w-7xl h-[90vh] max-h-[1000px] bg-slate-900 border-2 border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/10 flex flex-col overflow-hidden relative">
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