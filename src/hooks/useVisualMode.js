import { useState } from "react";

// Create a custom hook to set the initial mode
// make transition to another mode
// as well as return to the previous mode
export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  
  // Create a functionn to make transition to another mode
  // if replace is true, replace the current mode in history
  function transition(mode, replace = false) {
    setMode(mode);
    if (replace) {
      setHistory(prev => [...prev.slice(0, prev.length - 1), mode]);
    } else {
      setHistory(prev => [...prev, mode]);
    }
  };
  
  // Create a function to return to the previous mode
  // It will not return to the previous mode if already at the inital mode
  function back() {
    if (history.length > 1) {
      setMode(history[history.length - 2]);
      setHistory(prev => prev.slice(0, prev.length - 1)); 
    } 
  };

  return { mode, transition, back };
}
