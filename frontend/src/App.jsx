
jsx
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [goal, setGoal] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentStage, setCurrentStage] = useState('');
  const wsRef = useRef(null);
  const sessionId = useRef(Math.random().toString(36).substring(7));

  const connectWebSocket = () => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${sessionId.current}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'started':
          setCurrentStage('Started');
          addProgress('Agent execution started', 'info');
          break;
          
        case 'progress':
          handleProgress(message.data);
          break;
          
        case 'completed':
          setIsRunning(false);
          setResult(message.data);
          setCurrentStage('Completed');
          addProgress('Agent execution completed!', 'success');
          break;
          
        case 'error':
          setIsRunning(false);
          setError(message.message);
          addProgress(`Error: ${message.message}`, 'error');
          break;
          
        default:
          console.log('Unknown message type:', message.type);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Connection error');
      setIsRunning(false);
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };
    
    wsRef.current = ws;
  };

  const handleProgress = (data) => {
    if (data.stage === 'understanding') {
      setCurrentStage('Understanding Goal');
      addProgress(`Goal understood: ${data.data.objective}`, 'info');
    } else if (data.stage === 'planning') {
      setCurrentStage('Creating Plan');
      addProgress(`Created plan with ${data.data.length} steps`, 'info');
    } else if (data.steps_completed !== undefined) {
      setCurrentStage(`Executing Step ${data.steps_completed}/${data.total_steps}`);
      const lastStep = data.step_results[data.step_results.length - 1];
      if (lastStep) {
        addProgress(
          `Step ${lastStep.step_number}: ${lastStep.step.description}`,
          lastStep.status === 'completed' ? 'success' : 'error'
        );
      }
    }
  };

  const addProgress = (message, type = 'info') => {
    setProgress(prev => [...prev, {
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!goal.trim()) return;
    
    setIsRunning(true);
    setProgress([]);
    setResult(null);
    setError(null);
    setCurrentStage('Connecting');
    
    connectWebSocket();
    
    // Wait for connection then send goal
    setTimeout(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ goal }));
      }
    }, 500);
  };

  const handleStop = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setIsRunning(false);
    setCurrentStage('Stopped');
    addProgress('Execution stopped by user', 'warning');
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🤖 Autonomous Research Agent</h1>
        <p>AI Agent that understands goals, plans, and executes research tasks</p>
      </header>

      <main className="App-main">
        <section className="input-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="goal">Research Goal:</label>
              <textarea
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Create a comprehensive market analysis report for electric vehicles in Europe"
                rows="4"
                disabled={isRunning}
              />
            </div>
            
            <div className="button-group">
              {!isRunning ? (
                <button type="submit" className="btn btn-primary" disabled={!goal.trim()}>
                  🚀 Start Agent
                </button>
              ) : (
                <button type="button" className="btn btn-danger" onClick={handleStop}>
                  ⏹ Stop
                </button>
              )}
            </div>
          </form>
        </section>

        {currentStage && (
          <section className="status-section">
            <div className="status-badge">
              {isRunning && <span className="spinner">⟳</span>}
              Current Stage: <strong>{currentStage}</strong>
            </div>
          </section>
        )}

        {progress.length > 0 && (
          <section className="progress-section">
            <h2>Progress Log</h2>
            <div className="progress-log">
              {progress.map((item, index) => (
                <div key={index} className={`progress-item ${item.type}`}>
                  <span className="timestamp">{item.timestamp}</span>
                  <span className="message">{item.message}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {error && (
          <section className="error-section">
            <h2>❌ Error</h2>
            <p>{error}</p>
          </section>
        )}

        {result && result.output && (
          <section className="result-section">
            <h2>✅ Final Result</h2>
            <div className="result-output">
              <pre>{result.output}</pre>
            </div>
            
            {result.execution && (
              <div className="execution-summary">
                <h3>Execution Summary</h3>
                <p>Steps completed: {result.execution.steps_completed}/{result.execution.total_steps}</p>
                <p>Status: {result.execution.status}</p>
              </div>
            )}
          </section>
        )}

        <section className="examples-section">
          <h2>Example Goals</h2>
          <div className="examples">
            <button 
              className="example-btn"
              onClick={() => setGoal("Research the latest developments in AI safety and create a summary report")}
              disabled={isRunning}
            >
              AI Safety Research
            </button>
            <button 
              className="example-btn"
              onClick={() => setGoal("Analyze the global renewable energy market trends for 2024 and provide key insights")}
              disabled={isRunning}
            >
              Renewable Energy Analysis
            </button>
            <button 
              className="example-btn"
              onClick={() => setGoal("Investigate quantum computing applications in cryptography and summarize findings")}
              disabled={isRunning}
            >
              Quantum Computing Report
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
