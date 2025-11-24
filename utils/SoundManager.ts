let isSoundEnabled = true;

export const setSoundEnabled = (enabled: boolean) => {
    isSoundEnabled = enabled;
};

export const playSfx = (type: 'click' | 'success' | 'error' | 'money') => {
    if (!isSoundEnabled) return;
    try {
        // Tarayıcı ses motorunu başlat
        const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === 'click') {
            // Tok, mekanik tık sesi
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        }
        else if (type === 'success') {
            // Başarı sesi (Çift tonlu ince ses)
            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, now);
            osc.frequency.linearRampToValueAtTime(1000, now + 0.1);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        }
        else if (type === 'money') {
            // Kasa Sesi (Cha-ching!)
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1200, now);
            osc.frequency.exponentialRampToValueAtTime(1800, now + 0.1);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
        }
        else if (type === 'error') {
            // Hata sesi (Kalın testere dişi)
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.2);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        }

    } catch (e) {
        console.error("Audio Error:", e);
    }
};