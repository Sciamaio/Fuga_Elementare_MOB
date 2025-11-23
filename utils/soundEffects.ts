
// Simple synthesizer for sound effects using Web Audio API
// This avoids external file dependencies and loading issues

let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtx;
};

export const playSound = (type: 'click' | 'correct' | 'wrong' | 'unlock' | 'type', isMuted: boolean) => {
    if (isMuted) return;

    try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;

        switch (type) {
            case 'click':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(600, now);
                oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.1);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                oscillator.start(now);
                oscillator.stop(now + 0.1);
                break;

            case 'unlock':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(400, now);
                oscillator.frequency.linearRampToValueAtTime(800, now + 0.1);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
                oscillator.start(now);
                oscillator.stop(now + 0.3);
                break;

            case 'correct':
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(440, now); // A4
                oscillator.frequency.setValueAtTime(554, now + 0.1); // C#5
                oscillator.frequency.setValueAtTime(659, now + 0.2); // E5
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
                oscillator.start(now);
                oscillator.stop(now + 0.4);
                break;

            case 'wrong':
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(150, now);
                oscillator.frequency.linearRampToValueAtTime(100, now + 0.3);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
                oscillator.start(now);
                oscillator.stop(now + 0.3);
                break;
            
            case 'type':
                // Very short click for typing
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(800, now);
                gainNode.gain.setValueAtTime(0.02, now); // Very quiet
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
                oscillator.start(now);
                oscillator.stop(now + 0.03);
                break;
        }
    } catch (e) {
        console.error("Audio play failed", e);
    }
};
