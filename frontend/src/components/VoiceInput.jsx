import { useEffect, useRef, useState } from 'react';
import { Check, Mic, Square, Trash2, Volume2 } from 'lucide-react';

const LANGUAGES = [
  { code: 'en-IN', label: 'English', native: 'English' },
  { code: 'ta-IN', label: 'Tamil', native: 'தமிழ்' },
  { code: 'hi-IN', label: 'Hindi', native: 'हिन्दी' },
  { code: 'te-IN', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ml-IN', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'kn-IN', label: 'Kannada', native: 'ಕನ್ನಡ' }
];

export const DEMO_TRANSCRIPT = 'Tomato 500 kilograms available tomorrow';

export default function VoiceInput({ language, onLanguageChange, onTranscript }) {
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');
  const [state, setState] = useState('IDLE');
  const [transcript, setTranscript] = useState('');
  const supported = typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const updateTranscript = value => {
    transcriptRef.current = value;
    setTranscript(value);
    onTranscript?.(value);
  };

  const startListening = () => {
    if (!supported) { setState('UNSUPPORTED'); return; }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new Recognition();
    recognition.lang = language || 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onstart = () => setState('LISTENING');
    recognition.onresult = event => {
      const value = Array.from(event.results).map(result => result[0].transcript).join(' ');
      updateTranscript(value.trim());
      if (event.results[event.results.length - 1].isFinal) setState('SUCCESS');
    };
    recognition.onerror = event => setState(event.error === 'not-allowed' || event.error === 'audio-capture' ? 'ERROR' : 'ERROR');
    recognition.onend = () => setState(current => current === 'LISTENING' ? (transcriptRef.current ? 'SUCCESS' : 'ERROR') : current);
    recognitionRef.current = recognition;
    setState('PROCESSING');
    try { recognition.start(); } catch { setState('ERROR'); }
  };

  const stopListening = () => { recognitionRef.current?.stop(); setState(transcript ? 'SUCCESS' : 'ERROR'); };
  const clear = () => { recognitionRef.current?.abort(); updateTranscript(''); setState('IDLE'); };
  const useDemo = () => { recognitionRef.current?.abort(); updateTranscript(DEMO_TRANSCRIPT); setState('SUCCESS'); };
  const visibleState = state === 'ERROR' && transcript ? 'SUCCESS' : state;
  const message = { IDLE: 'Ready when you are', LISTENING: 'Listening...', PROCESSING: 'Preparing microphone...', SUCCESS: 'Voice captured', ERROR: 'Microphone unavailable or permission denied', UNSUPPORTED: 'Voice input is not supported by this browser.' }[visibleState];

  return <div className="voice-card panel">
    <div className="voice-card-heading"><div><span className="section-kicker">Voice crop listing</span><h2>Speak your harvest.</h2></div><Volume2 size={21}/></div>
    <label className="voice-language">Language<select value={language} onChange={event => onLanguageChange?.(event.target.value)}>{LANGUAGES.map(item => <option key={item.code} value={item.code}>{item.native} · {item.label}</option>)}</select></label>
    <div className={`voice-control ${visibleState.toLowerCase()}`}><button className="mic-button" onClick={visibleState === 'LISTENING' ? stopListening : startListening} aria-label={visibleState === 'LISTENING' ? 'Stop speaking' : 'Start speaking'}>{visibleState === 'LISTENING' ? <Square size={24}/> : <Mic size={27}/>}</button><strong>{message}</strong><small>{visibleState === 'LISTENING' ? 'Tap to stop recording' : 'Use a clear, short sentence'}</small></div>
    {(visibleState === 'UNSUPPORTED' || visibleState === 'ERROR') && <div className="voice-error"><span>{message}</span><button className="button quiet" onClick={useDemo}>Use Demo Voice</button></div>}
    <div className="transcript-box"><div><span>Transcript</span>{transcript && <button onClick={clear} title="Clear transcript"><Trash2 size={15}/></button>}</div><p>{transcript || 'Your words will appear here...'}</p></div>
    {visibleState === 'SUCCESS' && <div className="voice-success"><Check size={16}/> Voice captured. Please confirm the detected information below.</div>}
  </div>;
}

export { LANGUAGES };
