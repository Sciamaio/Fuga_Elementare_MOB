import React from 'react';
import { ClockIcon } from './icons';

interface TimeUpModalProps {
    isOpen: boolean;
    onConfirm: () => void;
}

const TimeUpModal: React.FC<TimeUpModalProps> = ({ isOpen, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300">
            <div className={`bg-slate-800 rounded-lg border-2 border-red-500/50 shadow-2xl shadow-red-500/10 w-full max-w-md m-4 transform transition-all duration-300 scale-100 p-8 text-center`}>
                <div className="flex justify-center mb-6">
                    <ClockIcon className={`w-24 h-24 text-red-500`} />
                </div>
                <h2 className={`font-orbitron text-4xl font-bold text-red-500 mb-4`}>TEMPO SCADUTO</h2>
                <p className="text-slate-300 mb-6 text-lg">
                    Hai esaurito il tempo a disposizione. La partita verrà riavviata.
                </p>
                <button
                    onClick={onConfirm}
                    className={`w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-lg text-lg uppercase tracking-wider font-orbitron transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1`}
                >
                    Riavvia
                </button>
            </div>
        </div>
    );
};

export default TimeUpModal;
