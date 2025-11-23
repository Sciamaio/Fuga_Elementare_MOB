import React from 'react';

const AtomInputAnimation: React.FC = () => {
    return (
        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            {/* Nucleus */}
            <div className="absolute w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] animate-pulse z-10"></div>

            {/* Orbit 1 */}
            <div className="absolute w-full h-full animate-[spin_3s_linear_infinite]">
                <div className="w-full h-full rounded-full border border-cyan-500/30 skew-x-[60deg]"></div>
                <div className="absolute top-[10%] left-[15%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_#fff]"></div>
            </div>

            {/* Orbit 2 */}
            <div className="absolute w-full h-full animate-[spin_4s_linear_infinite_reverse]">
                <div className="w-full h-full rounded-full border border-cyan-500/30 skew-y-[60deg]"></div>
                <div className="absolute bottom-[15%] right-[10%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_#fff]"></div>
            </div>
            
             {/* Orbit 3 - Circular */}
             <div className="absolute w-[70%] h-[70%] animate-[spin_2s_linear_infinite]">
                <div className="w-full h-full rounded-full border border-cyan-500/40"></div>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-200 rounded-full shadow-[0_0_5px_#a5f3fc]"></div>
            </div>
        </div>
    );
};

export default AtomInputAnimation;