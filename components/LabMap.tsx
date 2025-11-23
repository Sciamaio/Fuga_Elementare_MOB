
import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Screen, Room } from '../types';
import { CheckIcon, LockIcon, DoorIcon, ExitIcon } from './icons';

const COMPLETED_COLORS = [
    { border: 'border-green-400', bg: 'bg-green-500/20', shadow: 'shadow-green-500/20', text: 'text-green-300' },
    { border: 'border-violet-400', bg: 'bg-violet-500/20', shadow: 'shadow-violet-500/20', text: 'text-violet-300' },
    { border: 'border-amber-400', bg: 'bg-amber-500/20', shadow: 'shadow-amber-500/20', text: 'text-amber-300' },
    { border: 'border-teal-400', bg: 'bg-teal-500/20', shadow: 'shadow-teal-500/20', text: 'text-teal-300' },
    { border: 'border-rose-400', bg: 'bg-rose-500/20', shadow: 'shadow-rose-500/20', text: 'text-rose-300' },
];

// Bubbling animation component
const BubblingBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
            <div
                key={i}
                className="absolute rounded-full bg-cyan-400/20 animate-float-bubble"
                style={{
                    width: `${Math.random() * 40 + 10}px`,
                    height: `${Math.random() * 40 + 10}px`,
                    left: `${Math.random() * 100}%`,
                    bottom: `-${Math.random() * 100}px`,
                    animationDuration: `${Math.random() * 5 + 5}s`,
                    animationDelay: `${Math.random() * 5}s`,
                }}
            />
        ))}
        <style>{`
            @keyframes float-bubble {
                0% { transform: translateY(0) scale(1); opacity: 0; }
                10% { opacity: 0.5; }
                100% { transform: translateY(-120vh) scale(1.5); opacity: 0; }
            }
            .animate-float-bubble {
                animation-name: float-bubble;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }
        `}</style>
    </div>
);

interface RoomNodeProps {
    room: Room;
    isCompleted: boolean;
    isCurrent: boolean;
    isLocked: boolean;
    onClick: () => void;
}

const RoomNode: React.FC<RoomNodeProps> = ({ room, isCompleted, isCurrent, isLocked, onClick }) => {
    let statusClasses = "bg-slate-800/80 border-slate-700 text-slate-500";
    let icon = <LockIcon className="w-8 h-8 md:w-10 md:h-10" />;

    if (isCompleted) {
        const color = COMPLETED_COLORS[(room.id - 1) % COMPLETED_COLORS.length];
        statusClasses = `${color.bg} ${color.border} ${color.text} ${color.shadow} shadow-lg cursor-pointer hover:scale-105`;
        icon = <CheckIcon className="w-10 h-10 md:w-12 md:h-12" />;
    } else if (isCurrent) {
        statusClasses = "bg-cyan-500/20 border-cyan-400 text-cyan-300 animate-pulse-slow cursor-pointer shadow-lg shadow-cyan-500/30 hover:scale-110";
        icon = <DoorIcon className="w-10 h-10 md:w-12 md:h-12" />;
    }

    const canClick = isCurrent || isCompleted;

    return (
        <div className="flex flex-col items-center relative z-10 group m-2">
            {/* Label above (Group/Theme) */}
            <div className={`absolute -top-12 text-center w-48 transition-opacity duration-300 ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                 <span className="text-xs font-bold text-slate-400 bg-slate-900/90 px-2 py-1 rounded border border-slate-700 shadow-xl">{room.group}</span>
            </div>

            {/* Node Circle */}
            <div
                className={`w-20 h-20 md:w-28 md:h-28 rounded-full flex flex-col items-center justify-center p-2 border-4 transition-all duration-300 ${statusClasses}`}
                onClick={canClick ? onClick : undefined}
            >
                <div className="text-xs md:text-base font-bold font-orbitron text-center leading-tight">{room.name}</div>
                <div className="mt-1">{icon}</div>
            </div>
             
             {/* Order Number Badge */}
             <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 bg-slate-900 z-20 ${isCompleted ? 'border-green-500 text-green-400' : isCurrent ? 'border-cyan-400 text-cyan-400' : 'border-slate-600 text-slate-600'}`}>
                {room.id}
             </div>
        </div>
    );
};

const HorizontalConnector: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <div className={`h-2 w-6 md:w-12 transition-colors duration-500 ${isActive ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : 'bg-slate-700'}`}></div>
);

const LabMap: React.FC = () => {
    const { setCurrentRoomIndex, completedRooms, setScreen, currentRooms, quitGame } = useGame();
    const activeRoomIndex = completedRooms.length;

    useEffect(() => {
        if (activeRoomIndex < currentRooms.length) {
            setCurrentRoomIndex(activeRoomIndex);
        }
    }, [completedRooms.length, currentRooms.length, setCurrentRoomIndex, activeRoomIndex]);

    const handleRoomClick = (index: number) => {
        const room = currentRooms[index];
        const isCompleted = completedRooms.includes(room.id);
        if (index === activeRoomIndex || isCompleted) {
            setCurrentRoomIndex(index);
            setScreen(Screen.Game);
        }
    };

    if (currentRooms.length === 0) {
        return <div className="flex items-center justify-center h-full">Caricamento mappa...</div>;
    }

    // Split rooms into two rows of 4 (Total 8)
    const row1 = currentRooms.slice(0, 4);
    const row2 = currentRooms.slice(4, 8);

    return (
        <div className="flex flex-col h-full bg-slate-900 relative overflow-hidden">
            <BubblingBackground />
            <div className="absolute inset-0 bg-grid-cyan-500/5 pointer-events-none"></div>

            <header className="flex justify-between items-center p-4 border-b-2 border-slate-700/50 bg-slate-800/40 backdrop-blur-sm z-20 shrink-0">
                <button onClick={quitGame} className="text-slate-400 hover:text-cyan-300 transition-colors">
                    <ExitIcon className="w-8 h-8" />
                </button>
                <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-cyan-300 text-center text-shadow-neon-cyan-sm">Mappa del Laboratorio</h2>
                <div className="w-8"></div>
            </header>
            
            <div className="flex-1 flex items-center justify-center p-8 overflow-auto custom-scrollbar z-10">
                <div className="min-w-fit p-10 flex flex-col relative">
                    
                    {/* Row 1: Left to Right */}
                    <div className="flex items-center">
                        {row1.map((room, idx) => (
                            <React.Fragment key={room.id}>
                                <RoomNode
                                    room={room}
                                    isCompleted={completedRooms.includes(room.id)}
                                    isCurrent={room.id - 1 === activeRoomIndex}
                                    isLocked={room.id - 1 > activeRoomIndex}
                                    onClick={() => handleRoomClick(room.id - 1)}
                                />
                                {/* Horizontal connector */}
                                {idx < row1.length - 1 && (
                                    <HorizontalConnector isActive={completedRooms.includes(room.id)} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Spacer for vertical gap */}
                    <div className="h-16 md:h-24"></div>

                    {/* Row 2: Right to Left Layout (Visual Reverse) */}
                    <div className="flex items-center flex-row-reverse">
                        {row2.map((room, idx) => {
                            return (
                                <React.Fragment key={room.id}>
                                    <RoomNode
                                        room={room}
                                        isCompleted={completedRooms.includes(room.id)}
                                        isCurrent={room.id - 1 === activeRoomIndex}
                                        isLocked={room.id - 1 > activeRoomIndex}
                                        onClick={() => handleRoomClick(room.id - 1)}
                                    />
                                    {/* Connector to the LEFT (visually right due to flex-reverse) */}
                                    {idx < row2.length - 1 && (
                                        <HorizontalConnector isActive={completedRooms.includes(room.id)} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LabMap;
