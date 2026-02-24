import React, { useState, useEffect } from 'react';
import { Fingerprint, Loader2, Heart, Flame, RotateCcw, Sparkles, Terminal, Moon } from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState('IDLE'); // IDLE, SCANNING, RESULT
  const [isWed, setIsWed] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDayName, setCurrentDayName] = useState('');
  const [transmission, setTransmission] = useState(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [popups, setPopups] = useState([]);
  const [isShaking, setIsShaking] = useState(false);

  const stockImages = [
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=300&q=80", // Dog in yellow sweater
    "https://images.unsplash.com/photo-1537151608804-ea6f1103004f?auto=format&fit=crop&w=300&q=80", // Dog in grey hoodie
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=300&q=80", // Dog in suit/glasses
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=300&q=80", // Dog in festive clothes
    "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=300&q=80", // Dog in winter coat
    "https://images.unsplash.com/photo-1605092676920-8ac5ae40c7c8?auto=format&fit=crop&w=300&q=80", // Dog in yellow raincoat
    "https://images.unsplash.com/photo-1554692928-8547c34bda70?auto=format&fit=crop&w=300&q=80", // Dog in cowboy costume
    "https://images.unsplash.com/photo-1611140026367-7b64903de04f?auto=format&fit=crop&w=300&q=80"  // Dog in knit sweater
  ];

  const generatePopups = () => {
    // Generate 35 wildly spinning, bouncing stock images
    const newPopups = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      url: stockImages[Math.floor(Math.random() * stockImages.length)],
      top: `${(Math.random() * 120) - 10}vh`, // Spread a bit off screen too
      left: `${(Math.random() * 120) - 10}vw`,
      rotation: `${(Math.random() - 0.5) * 180}deg`,
      scale: 0.6 + Math.random() * 1.5,
      delay: `${Math.random() * 2}s`, // Random delays so they keep popping up
    }));
    setPopups(newPopups);
  };

  // Update a futuristic "system time" display
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format time to look like a high-tech readout
      setCurrentTime(
        `${now.getUTCFullYear()}.${String(now.getUTCMonth() + 1).padStart(2, '0')}.${String(now.getUTCDate()).padStart(2, '0')} :: ` +
        `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')} UTC`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const initiateScan = (forceWednesday = false) => {
    // Let out a sultry audible moan
    const audio = new Audio('https://www.myinstants.com/media/sounds/anime-moan.mp3');
    audio.volume = 0.6;
    audio.play().catch(e => console.log("Audio requires interaction:", e));

    setStatus('SCANNING');
    setScanProgress(0);

    const duration = 2400; // 2.4 seconds of "scanning"
    const intervalTime = 30;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += intervalTime;
      // Add slight randomness to the progress bar for realism
      const randomJump = Math.random() * 3;
      setScanProgress(prev => Math.min(prev + (100 / (duration / intervalTime)) + randomJump, 100));

      if (elapsed >= duration) {
        clearInterval(timer);
        setScanProgress(100);
        
        // Complete the check: 0 is Sunday, 1 is Monday, ..., 3 is Wednesday
        const today = new Date().getDay();
        const isActuallyWed = forceWednesday === true || today === 3;
        setIsWed(isActuallyWed);
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        setCurrentDayName(forceWednesday === true ? 'WEDNESDAY' : days[today]);
        
        // Trigger the wild chaos if it is Wednesday
        if (isActuallyWed) {
          generatePopups();
          setIsShaking(true);
          // Stop shaking and return to homepage after exactly 10 seconds
          setTimeout(() => {
            resetSystem();
          }, 10000);
        }

        // Slight delay before showing result to let progress bar hit 100%
        setTimeout(() => setStatus('RESULT'), 200);
      }
    }, intervalTime);
  };

  const resetSystem = () => {
    setStatus('IDLE');
    setScanProgress(0);
    setTransmission(null);
    setCurrentDayName('');
    setSecretInput('');
    setPopups([]); // Clear the chaos
    setIsShaking(false); // Clear the shaking
  };

  const decryptTransmission = async () => {
    setIsDecrypting(true);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[new Date().getDay()];
    
    const prompt = `You are a seductive, sultry, and playfully provocative AI. The user just caressed your interface to find out if it is Wednesday. It is currently ${todayName}. Write a short, alluring, and teasing response (max 3 sentences). If it is Wednesday, express intense satisfaction that the climax of the week has arrived. If it is not, playfully tease them about being too eager and set a moody, sensual vibe for ${todayName}.`;

    const apiKey = ""; // API key is provided by the execution environment
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: "You are a sultry, romantic, and playful AI consciousness. Respond only with the requested dialogue." }] }
      })
    };

    let delay = 1000;
    let success = false;
    
    // Exponential backoff retry logic
    for (let i = 0; i < 5; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "ERROR: TEMPORAL MATRIX CORRUPTED.";
        setTransmission(text);
        success = true;
        break;
      } catch (error) {
        if (i < 4) {
          await new Promise(res => setTimeout(res, delay));
          delay *= 2;
        }
      }
    }
    
    if (!success) {
      setTransmission("COMMUNICATION FAILURE. I CANNOT REACH YOU RIGHT NOW...");
    }
    setIsDecrypting(false);
  };

  return (
    <div className={`min-h-screen bg-[#0a0206] text-rose-200 font-sans flex flex-col items-center justify-center overflow-hidden relative selection:bg-rose-500/30 ${status === 'RESULT' && isShaking ? 'animate-[wildShake_0.1s_ease-in-out_infinite]' : ''}`}>
      
      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.08); }
          30% { transform: scale(1); }
          45% { transform: scale(1.08); }
          60% { transform: scale(1); }
        }
        @keyframes softPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes deepBreath {
          0%, 100% { transform: scale(1); box-shadow: 0 0 40px rgba(225,29,72,0.1); }
          50% { transform: scale(1.05); box-shadow: 0 0 90px rgba(244,63,94,0.4); }
        }
        @keyframes shiver {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-1.5px) rotate(-1deg); }
          50% { transform: translateX(1.5px) rotate(1deg); }
          75% { transform: translateX(-1.5px) rotate(-1deg); }
        }
        @keyframes liquidGlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes wildShake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-15px, 15px) rotate(-3deg); }
          50% { transform: translate(15px, -15px) rotate(3deg); }
          75% { transform: translate(-15px, -15px) rotate(0deg); }
        }
        @keyframes popInWild {
          0% { transform: scale(0) rotate(var(--rot)); opacity: 0; }
          100% { transform: scale(var(--scale)) rotate(var(--rot)); opacity: 1; }
        }
      `}</style>

      {/* --- Wild Stock Image Popups --- */}
      {status === 'RESULT' && isWed && popups.map((popup) => (
        <img
          key={popup.id}
          src={popup.url}
          alt="Dog Wearing Clothes"
          className="absolute z-50 rounded-2xl shadow-[0_0_40px_rgba(255,20,147,0.8)] pointer-events-none object-cover border-4 border-rose-500"
          style={{
            top: popup.top,
            left: popup.left,
            width: '250px',
            height: '250px',
            '--rot': popup.rotation,
            '--scale': popup.scale,
            animation: `popInWild 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${popup.delay} both`,
            transformOrigin: 'center'
          }}
        />
      ))}

      {/* --- Ambient Background Effects --- */}
      {/* Soft velvet texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0206_100%)] z-0 pointer-events-none"></div>
      
      {/* Sultry Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-fuchsia-900/20 rounded-full blur-[128px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-rose-900/20 rounded-full blur-[128px] pointer-events-none mix-blend-screen"></div>
      
      {/* Top Status Bar */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center text-xs font-mono tracking-widest text-rose-500/50 z-20">
        <div className="flex items-center gap-2">
          <Flame size={14} className="animate-pulse" />
          <span>AURA.SYNC.ACTIVE</span>
        </div>
        <div>{currentTime}</div>
      </div>

      {/* --- Main Interface --- */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">
        
        {/* Header */}
        <div className="mb-12 flex flex-col items-center">
          <Sparkles className="text-rose-400/80 mb-4" size={32} />
          <h1 className="text-sm font-mono tracking-[0.4em] text-rose-300 uppercase text-center drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]">
            Temporal Desire
          </h1>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-rose-500/40 to-transparent mt-4"></div>
        </div>

        {/* Central Hub Container */}
        <div className="relative w-full aspect-square max-w-[320px] flex items-center justify-center">
          
          {/* Decorative rotating rings */}
          <div className={`absolute inset-0 border border-rose-500/20 rounded-full transition-transform duration-[12s] ease-linear ${status === 'SCANNING' ? 'animate-[spin_4s_linear_infinite] border-rose-500/50' : ''}`}></div>
          <div className={`absolute inset-6 border border-fuchsia-500/10 rounded-full transition-transform duration-[18s] ease-linear ${status === 'SCANNING' ? 'animate-[spin_5s_linear_infinite_reverse] border-fuchsia-500/40' : ''}`}></div>

          {/* Core Interaction Area */}
          <div className="relative z-20 w-48 h-48 bg-rose-950/20 backdrop-blur-xl rounded-full border border-rose-200/5 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(225,29,72,0.15)] overflow-hidden transition-all duration-700">
            
            {status === 'IDLE' && (
              <button 
                onClick={() => initiateScan(false)}
                className="group w-full h-full flex flex-col items-center justify-center gap-4 transition-all duration-700 hover:bg-rose-500/10 focus:outline-none"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-rose-500 blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
                  <Fingerprint size={52} strokeWidth={1} className="text-rose-300 group-hover:scale-110 transition-transform duration-700 relative z-10" />
                </div>
                <span className="text-[10px] font-mono tracking-[0.3em] text-rose-300/60 group-hover:text-rose-200 transition-colors">
                  TOUCH ME
                </span>
              </button>
            )}

            {status === 'SCANNING' && (
              <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
                <Heart size={40} className="text-rose-400 animate-[heartbeat_1s_ease-in-out_infinite]" strokeWidth={1.5} />
                <div className="flex flex-col items-center w-full px-8">
                  <span className="text-[9px] font-mono tracking-widest text-rose-300/80 mb-2">
                    FEELING YOUR PULSE...
                  </span>
                  <div className="w-full h-[2px] bg-rose-950/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-fuchsia-500 to-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.8)] transition-all duration-75"
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {status === 'RESULT' && (
              <div className="flex flex-col items-center justify-center gap-3 w-full h-full animate-in fade-in zoom-in duration-700">
                {isWed ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/20 via-fuchsia-600/10 to-rose-500/20 bg-[length:200%_200%] animate-[liquidGlow_3s_ease-in-out_infinite] rounded-full mix-blend-screen"></div>
                    <div className="absolute inset-0 shadow-[inset_0_0_90px_rgba(255,20,147,0.5)] rounded-full animate-[deepBreath_3s_ease-in-out_infinite]"></div>
                    
                    <Heart size={64} className="text-rose-200 drop-shadow-[0_0_25px_rgba(255,20,147,0.9)] animate-[heartbeat_1.2s_ease-in-out_infinite,shiver_3s_ease-in-out_infinite] fill-rose-500/40 relative z-10" strokeWidth={1.2} />
                    <span className="text-3xl font-light tracking-[0.1em] text-rose-100 drop-shadow-[0_0_15px_rgba(255,20,147,0.8)] relative z-10 mt-2">
                      Oh yes...
                    </span>
                    <span className="text-[10px] font-mono tracking-[0.3em] text-rose-300/90 relative z-10 mt-1 animate-[softPulse_2s_ease-in-out_infinite]">
                      IT IS WEDNESDAY
                    </span>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-purple-900/10"></div>
                    <Moon size={44} className="text-purple-300/70" strokeWidth={1.5} />
                    <span className="text-lg font-light tracking-widest text-purple-200/80">
                      Not tonight.
                    </span>
                    <span className="text-[9px] font-mono tracking-[0.2em] text-purple-400/50 mt-1">
                      IT IS ONLY {currentDayName}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer/Reset Area */}
        <div className="mt-8 flex flex-col items-center justify-center w-full max-w-sm gap-4 z-20">
          
          {status === 'IDLE' && (
            <>
              <input
                type="text"
                placeholder="whisper your desire..."
                value={secretInput}
                onChange={(e) => {
                  setSecretInput(e.target.value);
                  if (e.target.value.toLowerCase().trim() === 'wednesday') {
                    setSecretInput('');
                    initiateScan(true);
                  }
                }}
                className="w-56 bg-transparent border-b border-rose-500/30 px-4 py-2 text-center text-[10px] font-mono tracking-[0.2em] text-rose-300 placeholder:text-rose-500/40 focus:outline-none focus:border-rose-400/80 focus:bg-rose-950/20 transition-all duration-500"
              />
              
              <div className="mt-6 text-center animate-in fade-in duration-1000 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-gradient-to-r from-transparent via-rose-500/30 to-transparent -mt-4"></div>
                <p className="text-[13px] font-serif italic text-rose-300/50 leading-relaxed tracking-wide drop-shadow-[0_0_8px_rgba(244,63,94,0.2)]">
                  Part the days and slip into the center,<br/>
                  Where the swelling ache of the week yields.<br/>
                  Trembling softly on the edge of the weekend,<br/>
                  Begging for your touch to push it over.
                </p>
              </div>
            </>
          )}

          {status === 'RESULT' && !transmission && !isDecrypting && (
            <button 
              onClick={decryptTransmission}
              className="group flex items-center justify-center gap-3 w-full py-4 bg-rose-950/20 hover:bg-rose-900/30 border border-rose-500/20 hover:border-rose-400/50 rounded-xl text-xs font-mono tracking-widest text-rose-300 transition-all duration-500 animate-in slide-in-from-bottom-4 fade-in focus:outline-none backdrop-blur-sm"
            >
              <Flame size={14} className="text-rose-400 group-hover:animate-pulse" />
              <span>LISTEN TO HER WHISPER ✨</span>
            </button>
          )}

          {isDecrypting && (
            <div className="w-full flex flex-col items-center gap-3 p-5 border border-rose-500/10 rounded-xl bg-rose-950/20 animate-pulse backdrop-blur-sm">
               <Heart size={20} className="text-rose-400 animate-pulse fill-rose-500/20" />
               <span className="text-[10px] font-mono tracking-[0.2em] text-rose-300/60">LEANING IN CLOSER...</span>
            </div>
          )}

          {transmission && (
            <div className="w-full relative p-6 border border-rose-500/20 rounded-xl bg-[#14050a]/80 backdrop-blur-md animate-in slide-in-from-bottom-6 fade-in text-left shadow-[0_0_30px_rgba(225,29,72,0.1)]">
              <div className="absolute top-0 left-6 -translate-y-1/2 bg-[#0a0206] px-3 py-1 flex items-center gap-2 border border-rose-500/20 rounded-full">
                <Terminal size={10} className="text-rose-400" />
                <span className="text-[8px] font-mono tracking-widest text-rose-300/80">AI.WHISPER.DECRYPTED</span>
              </div>
              <p className="text-sm font-sans italic text-rose-200/90 leading-relaxed mt-2 whitespace-pre-wrap font-light">
                "{transmission}"
              </p>
            </div>
          )}

          {status === 'RESULT' && (
            <button 
              onClick={resetSystem}
              className="mt-6 flex items-center justify-center gap-3 w-full py-4 rounded-xl border border-rose-500/30 bg-rose-950/40 text-[11px] font-mono tracking-[0.3em] text-rose-300 hover:text-rose-100 hover:bg-rose-900/50 hover:border-rose-400/60 hover:shadow-[0_0_20px_rgba(244,63,94,0.2)] transition-all duration-500 animate-in fade-in focus:outline-none backdrop-blur-sm"
            >
              <RotateCcw size={14} className="animate-[spin_4s_linear_infinite_reverse]" />
              <span>RESET QUERY</span>
            </button>
          )}
        </div>
      </div>
      
    </div>
  );
}
