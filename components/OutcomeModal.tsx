import React from 'react';
import { CheckIcon, XIcon } from './icons';

interface OutcomeModalProps {
    isOpen: boolean;
    isCorrect: boolean;

    attemptsLeft: number | null;
    onContinue: () => void;
    onTryAgain: () => void;
    onFailureConfirm: () => void;
}

const OutcomeModal: React.FC<OutcomeModalProps> = ({ isOpen, isCorrect, attemptsLeft, onContinue, onTryAgain, onFailureConfirm }) => {
    if (!isOpen) return null;

    const noAttemptsLeft = attemptsLeft !== null && attemptsLeft <= 0;

    const handleConfirm = () => {
        if (isCorrect) {
            onContinue();
        } else if (noAttemptsLeft) {
            onFailureConfirm();
        } else {
            onTryAgain();
        }
    };

    const title = isCorrect ? "ACCESSO AUTORIZZATO" : "ACCESSO NEGATO";
    const Icon = isCorrect ? CheckIcon : XIcon;
    const iconColor = isCorrect ? "text-green-400" : "text-red-500";
    const borderColor = isCorrect ? "border-green-500/50" : "border-red-500/50";
    const buttonColor = isCorrect ? "bg-cyan-500 hover:bg-cyan-400" : "bg-orange-500 hover:bg-orange-400";
    let buttonText = "PROSEGUI";
    if (!isCorrect) {
        buttonText = noAttemptsLeft ? "RIAVVIA GIOCO" : "RIPROVA";
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 transition-opacity duration-300 p-4">
            <div className={`bg-slate-800 rounded-lg border-2 ${borderColor} shadow-2xl shadow-cyan-500/10 w-full max-w-md transform transition-all duration-300 scale-100 p-6 md:p-8 text-center`}>
                <div className="flex justify-center mb-4 md:mb-6">
                    <Icon className={`w-16 h-16 md:w-24 md:h-24 ${iconColor}`} />
                </div>
                <h2 className={`font-orbitron text-2xl md:text-4xl font-bold ${iconColor} mb-4`}>{title}</h2>
                {!isCorrect && (
                    <p className="text-slate-300 mb-6 text-base md:text-lg">
                        {noAttemptsLeft
                            ? "Hai esaurito i tentativi. La partita verrà riavviata."
                            : attemptsLeft !== null 
                                ? `Tentativi rimasti: ${attemptsLeft}` 
                                : "Tentativi illimitati."}
                    </p>
                )}
                <button
                    onClick={handleConfirm}
                    className={`w-full ${buttonColor} text-slate-900 font-bold py-3 px-6 rounded-lg text-base md:text-lg uppercase tracking-wider font-orbitron transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1`}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default OutcomeModal;