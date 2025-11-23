import React, { useEffect, useRef, useState } from 'react';
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
    let icon = <LockIcon className="w-10 h-10 md:w-12 md:h-12" />;

    if (isCompleted) {
        const color = COMPLETED_COLORS[(room.id - 1) % COMPLETED_COLORS.length];
        statusClasses = `${color.bg} ${color.border} ${color.text} ${color.shadow} shadow-lg cursor-pointer hover:scale-105`;
        icon = <CheckIcon className="w-12 h-12 md:w-14 md:h-14" />;
    } else if (isCurrent) {
        statusClasses = "bg-cyan-500/20 border-cyan-400 text-cyan-300 animate-pulse-slow cursor-pointer shadow-lg shadow-cyan-500/30 hover:scale-110";
        icon = <DoorIcon className="w-12 h-12 md:w-14 md:h-14" />;
    }

    const canClick = isCurrent || isCompleted;

    return (
        <div className="flex flex-col items-center relative z-20 group">
            {/* Label above (Group/Theme) */}
            <div className={`absolute -top-8 md:-top-10 text-center w-40 md:w-48 transition-opacity duration-300 ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                 <span className="text-[10px] md:text-xs font-bold text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 shadow-xl whitespace-nowrap">{room.group}</span>
            </div>

            {/* Node Circle */}
            <div
                className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center p-2 border-4 md:border-6 transition-all duration-300 ${statusClasses}`}
                onClick={canClick ? onClick : undefined}
            >
                <div className="text-xs md:text-sm font-bold font-orbitron text-center leading-tight mb-1">{room.name}</div>
                <div className="mt-1">{icon}</div>
            </div>
             
             {/* Order Number Badge */}
             <div className={`absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base border-2 bg-slate-900 z-30 ${isCompleted ? 'border-green-500 text-green-400' : isCurrent ? 'border-cyan-400 text-cyan-400' : 'border-slate-600 text-slate-600'}`}>
                {room.id}
             </div>
        </div>
    );
};

// Curved Vertical Connector
const WavyConnector: React.FC<{ startOffset: number; endOffset: number; isActive: boolean; height: number }> = ({ startOffset, endOffset, isActive, height }) => {
    // Calculate SVG path points
    // We assume a centered coordinate system relative to the container width
    // But since we are in a flex column, we can treat the line as drawing from top-center + offset to bottom-center + offset
    
    // To handle the drawing, we'll use an SVG that spans the width of the 'wave' area
    // Let's say the wave area is 200px wide. 
    // Center is 100.
    // Start X = 100 + startOffset
    // End X = 100 + endOffset
    
    const containerWidth = 300; // Sufficient width to cover the zig-zag
    const centerX = containerWidth / 2;
    const x1 = centerX + startOffset;
    const x2 = centerX + endOffset;
    const y1 = 0;
    const y2 = height;
    
    // Control points for Bezier curve to make it smooth
    const cY1 = y1 + height * 0.5;
    const cY2 = y2 - height * 0.5;

    const path = `M ${x1} ${y1} C ${x1} ${cY1}, ${x2} ${cY2}, ${x2} ${y2}`;

    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[300px] pointer-events-none z-0" style={{ height: `${height}px` }}>
            <svg width="100%" height="100%" className="overflow-visible">
                {/* Background dark pipe */}
                <path d={path} fill="none" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                {/* Active fluid pipe */}
                <path 
                    d={path} 
                    fill="none" 
                    stroke={isActive ? "#06b6d4" : "#334155"} 
                    strokeWidth="6" 
                    strokeLinecap="round"
                    strokeDasharray={isActive ? "none" : "10 10"}
                    className={isActive ? "animate-pulse" : ""}
                />
                {isActive && (
                    <circle r="4" fill="#fff">
                        <animateMotion dur="2s" repeatCount="indefinite" path={path} />
                    </circle>
                )}
            </svg>
        </div>
    );
}

const LabMap: React.FC = () => {
    const { setCurrentRoomIndex, completedRooms, setScreen, currentRooms, quitGame } = useGame();
    const activeRoomIndex = completedRooms.length;
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to active room
    useEffect(() => {
        if (scrollRef.current) {
            // Simple timeout to ensure render is complete
            setTimeout(() => {
                const activeNode = scrollRef.current?.querySelector(`[data-room-id="${activeRoomIndex + 1}"]`);
                if (activeNode) {
                    activeNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
    }, [activeRoomIndex]);

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
        return <div className="flex items-center justify-center h-full text-cyan-400 font-orbitron">Inizializzazione Mappa...</div>;
    }

    // Define wave pattern offsets (pixels from center)
    // 0: Center
    // 1: Right (+60)
    // 2: Center (0)
    // 3: Left (-60)
    const getOffset = (index: number) => {
        const pattern = [0, 70, 0, -70];
        return pattern[index % pattern.length];
    };
    
    const connectorHeight = 80; // Vertical distance between nodes

    return (
        <div className="flex flex-col h-full bg-slate-900 relative overflow-hidden">
            <BubblingBackground />
            <div className="absolute inset-0 bg-grid-cyan-500/5 pointer-events-none"></div>

            <header className="flex justify-between items-center p-4 border-b-2 border-slate-700/50 bg-slate-800/40 backdrop-blur-sm z-40 shrink-0 shadow-xl">
                <button onClick={quitGame} className="text-slate-400 hover:text-cyan-300 transition-colors">
                    <ExitIcon className="w-8 h-8 md:w-10 md:h-10" />
                </button>
                <h2 className="font-orbitron text-2xl md:text-4xl font-bold text-cyan-300 text-center text-shadow-neon-cyan-sm">Mappa</h2>
                <div className="w-8 md:w-10"></div>
            </header>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar z-10 py-10">
                <div className="flex flex-col items-center relative min-h-max pb-20">
                    
                    {currentRooms.map((room, idx) => {
                        const offset = getOffset(idx);
                        const isLast = idx === currentRooms.length - 1;
                        const isActiveConnector = completedRooms.includes(room.id);

                        return (
                            <React.Fragment key={room.id}>
                                <div 
                                    className="relative z-20 transition-transform duration-500"
                                    style={{ transform: `translateX(${offset}px)` }}
                                    data-room-id={room.id}
                                >
                                    <RoomNode
                                        room={room}
                                        isCompleted={completedRooms.includes(room.id)}
                                        isCurrent={room.id - 1 === activeRoomIndex}
                                        isLocked={room.id - 1 > activeRoomIndex}
                                        onClick={() => handleRoomClick(room.id - 1)}
                                    />
                                    
                                    {/* Connector to next room */}
                                    {!isLast && (
                                        <WavyConnector 
                                            startOffset={0} // Relative to this node (which is already offset)
                                            endOffset={getOffset(idx + 1) - offset} // Calculate relative distance to next node
                                            height={connectorHeight} 
                                            isActive={isActiveConnector}
                                        />
                                    )}
                                </div>
                                
                                {/* Spacing for the connector */}
                                {!isLast && <div style={{ height: `${connectorHeight - 20}px` }}></div>}
                            </React.Fragment>
                        );
                    })}
                    
                    {/* Start Marker at the top (optional visual anchor) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-8 text-slate-600 text-xs font-orbitron tracking-widest opacity-50">INIZIO</div>
                </div>
            </div>
        </div>
    );
};

export default LabMap;