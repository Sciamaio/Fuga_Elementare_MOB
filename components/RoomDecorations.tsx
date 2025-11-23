
import React from 'react';

interface RoomDecorationsProps {
    group: string;
}

// ArchiveDeco removed as "L'Archivio" group is no longer used

const LabDeco: React.FC = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-16 -left-16 text-green-500/20 animate-pulse-slow">
            <HexagonGrid />
        </div>
         <div className="absolute -bottom-16 -right-16 text-green-500/20 animate-pulse-slow transform rotate-180" style={{ animationDelay: '1s' }}>
            <HexagonGrid />
        </div>
    </div>
);

const HexagonGrid = () => (
    <svg width="250" height="250" xmlns="http://www.w.w3.org/2000/svg">
        <defs>
            <symbol id="hexagon" viewBox="0 0 100 86.6">
                 <path d="M50 0 L100 25 V75 L50 100 L0 75 V25 Z" fill="none" stroke="currentColor" strokeWidth="4"/>
            </symbol>
        </defs>
        <use href="#hexagon" x="75" y="20" width="100" height="86.6" />
        <use href="#hexagon" x="25" y="63.3" width="100" height="86.6" />
        <use href="#hexagon" x="125" y="63.3" width="100" height="86.6" />
    </svg>
)


// WorldDeco is no longer explicitly used for "Sala Mondo" as it merged, 
// but we can reuse LibraryDeco for "Biblioteca scientifica" or create a mix.
// Since the prompt says "Biblioteca scientifica" for 5-8, we will use LibraryDeco.

const LibraryDeco: React.FC = () => (
    <>
       <CornerDeco className="absolute top-2 left-2 w-28 h-28 text-amber-500/30" />
       <CornerDeco className="absolute top-2 right-2 w-28 h-28 text-amber-500/30 transform -scale-x-1" />
       <CornerDeco className="absolute bottom-2 left-2 w-28 h-28 text-amber-500/30 transform -scale-y-1" />
       <CornerDeco className="absolute bottom-2 right-2 w-28 h-28 text-amber-500/30 transform -scale-x-1 -scale-y-1" />
    </>
)

const CornerDeco: React.FC<{className: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M0 60 C 30 30, 30 30, 60 0" />
        <path d="M0 80 C 40 40, 40 40, 80 0" />
        <circle cx="0" cy="0" r="4" fill="currentColor"/>
    </svg>
)

// FinalDeco kept just in case, though only 8 rooms are requested now.
const FinalDeco: React.FC = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden animate-pulse">
        <div className="absolute inset-2 border-4 border-red-500/50 rounded-md"></div>
        <div className="absolute inset-5 border-2 border-red-500/30 rounded-md"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-grid-red-500/10"></div>
    </div>
);


const RoomDecorations: React.FC<RoomDecorationsProps> = ({ group }) => {
    
    const renderDecorations = () => {
        switch (group) {
            case "Sala Laboratorio":
                return <LabDeco />;
            case "Biblioteca scientifica":
                return <LibraryDeco />;
            case "L'Enigma Finale": // In case room 8 is treated special or future expansion
                return <FinalDeco />;
            default:
                return null;
        }
    };

    return <div className="absolute inset-0 w-full h-full pointer-events-none z-0">{renderDecorations()}</div>;
};

export default RoomDecorations;
