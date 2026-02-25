import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// We updated these YouTube IDs to favor long mixes and live radios
// that are known to allow off-site iframe embedding.
const YOUTUBE_POOLS = {
    lofi: [
        'jfKfPfyJRdk', // Lofi Girl Radio
        '4xDzrJKXOOY', // Synthwave Radio
        'GW3B30KQczs' // Chillhop
    ],
    '90s': [
        'i9wswkhunrA', // 90s mix generic
        'kK0GDxqfe3s', // 90s chill mix
        'Hu3yS9fI'  // alternative 90s
    ],
    cn_underground: [
        { vid: 'llCvGm1nrq4', list: 'PLfjKTYTZxAzAvxM9N_-z_Qoc30u4XsZIj' }, // User requested mix 1
        { vid: 'BXsFnVQverk', list: 'RDEM218BkgObeFye-o3GorncJQ' } // User requested mix 2 (Radio)
    ]
};

const MUSIC = [
    { id: 'lofi', label: 'Lo-Fi', desc: 'Chill & Ambient' },
    { id: '90s', label: 'Vinyl DVS', desc: 'Nostalgic Energy' },
    { id: 'cn_underground', label: '中国地下音乐', desc: 'Alternative & Indie' },
];

const SESSIONS = [
    { id: 25, label: '25 Min', desc: 'Standard Focus' },
    { id: 50, label: '50 Min', desc: 'Deep Work' },
];

const pad = n => String(n).padStart(2, '0');
const fmt = s => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

function MinimalButton({ label, desc, onClick, selected }) {
    return (
        <button onClick={onClick} style={{
            background: selected ? '#ffffff' : 'transparent',
            border: `1px solid ${selected ? '#ffffff' : '#333'}`,
            borderRadius: '12px',
            padding: '20px 24px',
            cursor: 'pointer',
            textAlign: 'center',
            minWidth: '180px',
            flex: 1,
            color: selected ? '#000000' : '#888888',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            outline: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
        }}
            onMouseEnter={e => {
                if (!selected) {
                    e.currentTarget.style.borderColor = '#666';
                    e.currentTarget.style.color = '#cccccc';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                }
            }}
            onMouseLeave={e => {
                if (!selected) {
                    e.currentTarget.style.borderColor = '#333';
                    e.currentTarget.style.color = '#888888';
                    e.currentTarget.style.transform = 'translateY(0)';
                }
            }}
        >
            <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: '0.02em' }}>
                {label}
            </div>
            <div style={{ fontSize: 12, color: selected ? '#555555' : '#555555', letterSpacing: '0.05em' }}>
                {desc}
            </div>
        </button>
    );
}

export default function Pomodoro() {
    const navigate = useNavigate();
    const [step, setStep] = useState('duration');
    const [duration, setDuration] = useState(null);
    const [music, setMusic] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [paused, setPaused] = useState(false);
    const [activeYT, setActiveYT] = useState(null);

    // Countdown
    useEffect(() => {
        if (step !== 'running' || paused || timeLeft <= 0) return;
        const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
        return () => clearInterval(t);
    }, [step, paused, timeLeft]);

    useEffect(() => {
        if (step === 'running' && timeLeft === 0) {
            setActiveYT(null);
            setStep('done');
        }
    }, [timeLeft, step]);

    return (
        <>
            <style>{`
                body { margin:0; }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .anim-fiu { animation: fade-in-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
            `}</style>

            <div style={{
                minHeight: '100vh', background: '#0e0e0e', display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '2rem', position: 'relative', fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>

                {/* Subtle back button */}
                <button onClick={() => navigate('/')} style={{
                    position: 'absolute', top: '2rem', left: '2.5rem',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#666', fontSize: 12, fontWeight: 500,
                    letterSpacing: '0.05em', transition: 'color 0.2s ease',
                    textTransform: 'uppercase'
                }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#666'}
                >
                    ← Back
                </button>

                <div style={{ maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    {step === 'duration' && (
                        <div className="anim-fiu" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                            <h2 style={{ color: '#ffffff', fontSize: 24, fontWeight: 400, marginBottom: 48, letterSpacing: '0.02em' }}>Select Duration</h2>
                            <div style={{ display: 'flex', gap: 20, width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {SESSIONS.map(s => (
                                    <MinimalButton key={s.id} {...s} selected={duration === s.id}
                                        onClick={() => {
                                            setDuration(s.id);
                                            setTimeout(() => setStep('music'), 250);
                                        }} />
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'music' && (
                        <div className="anim-fiu" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                            <h2 style={{ color: '#ffffff', fontSize: 24, fontWeight: 400, marginBottom: 48, letterSpacing: '0.02em' }}>Select Ambiance</h2>
                            <div style={{ display: 'flex', gap: 20, width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {MUSIC.map(m => (
                                    <MinimalButton key={m.id} {...m} selected={music === m.id}
                                        onClick={() => {
                                            const pool = YOUTUBE_POOLS[m.id];
                                            const randomId = pool[Math.floor(Math.random() * pool.length)];
                                            setMusic(m.id);
                                            setActiveYT(randomId);
                                            setTimeout(() => {
                                                setTimeLeft(duration * 60);
                                                setStep('running');
                                            }, 250);
                                        }} />
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'running' && (
                        <div className="anim-fiu" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* Minimal visualizer / circle could go here, but pure text is cleaner */}
                            <div style={{
                                color: '#ffffff', fontSize: 120, fontWeight: 300,
                                fontFeatureSettings: '"tnum"', fontVariantNumeric: 'tabular-nums',
                                letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 24
                            }}>
                                {fmt(timeLeft)}
                            </div>

                            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 48 }}>
                                <span style={{ color: '#666', fontSize: 14, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{duration} Min</span>
                                <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#333' }} />
                                <span style={{ color: '#aaa', fontSize: 14, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{MUSIC.find(m => m.id === music)?.label}</span>
                            </div>

                            <div style={{ display: 'flex', gap: 24 }}>
                                <button onClick={() => setPaused(p => !p)} style={{
                                    background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 14, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'color 0.2s'
                                }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#888'}>
                                    {paused ? 'Resume' : 'Pause'}
                                </button>
                                <button onClick={() => { setActiveYT(null); setStep('done'); }} style={{
                                    background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 14, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'color 0.2s'
                                }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#555'}>
                                    Stop
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'done' && (
                        <div className="anim-fiu" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <h2 style={{ color: '#ffffff', fontSize: 32, fontWeight: 400, marginBottom: 16, letterSpacing: '0.02em' }}>Session Complete</h2>
                            <p style={{ color: '#777', fontSize: 16, lineHeight: 1.6, marginBottom: 48, maxWidth: 400 }}>
                                You have successfully maintained focus.<br />Take a moment to rest and reset.
                            </p>
                            <button onClick={() => { setStep('duration'); setDuration(null); setMusic(null); setActiveYT(null); }} style={{
                                background: '#ffffff', border: 'none', borderRadius: '30px', color: '#000000', padding: '16px 36px', cursor: 'pointer', fontSize: 14, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'transform 0.2s ease, opacity 0.2s ease'
                            }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.opacity = '0.9'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.opacity = '1'; }}>
                                New Session
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* Hidden YouTube audio - Unconditionally mounted for synchronous autoplay */}
            {activeYT && !paused && (
                <iframe
                    src={
                        typeof activeYT === 'string'
                            ? `https://www.youtube.com/embed/${activeYT}?autoplay=1&loop=1&playlist=${activeYT}&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`
                            : `https://www.youtube.com/embed/${activeYT.vid}?autoplay=1&loop=1&list=${activeYT.list}&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`
                    }
                    allow="autoplay; encrypted-media"
                    title="music"
                    style={{ position: 'absolute', width: 1, height: 1, opacity: 0.001, pointerEvents: 'none', zIndex: -100 }}
                />
            )}
        </>
    );
}
