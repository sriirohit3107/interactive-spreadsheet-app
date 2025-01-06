import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Plane } from '@react-three/drei';
import './App.css';

const App = () => {
  const [cells, setCells] = useState([]);
  const [editing, setEditing] = useState({ row: null, col: null, value: '' });
  const [gridSize, setGridSize] = useState({ rows: 10, cols: 10 });
  const [history, setHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const cellRefs = useRef([]);

  useEffect(() => {
    const fetchCells = async () => {
      const response = await fetch('http://localhost:5000/cells');
      if (response.ok) {
        const data = await response.json();
        setCells(data);
      } else {
        console.error('Failed to fetch cells');
      }
    };
    fetchCells();
  }, []);

  const handleCellChange = (e, row, col) => {
    setEditing({ row, col, value: e.target.value });
  };

  const handleCellSave = async (row, col) => {
    const { value } = editing;

    // Check if the value is an empty string
    if (value === "") {
      // If the value is empty, delete the cell
      await fetch('http://localhost:5000/cells', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ row, col, value: "" }),
      });

      setCells((prevCells) => prevCells.filter((cell) => !(cell.row === row && cell.col === col)));
      addToHistory({ row, col, value: "" });
      setEditing({ row: null, col: null, value: '' });
      return;
    }

    // Otherwise, update or create the cell
    const response = await fetch('http://localhost:5000/cells', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ row, col, value }),
    });

    if (response.ok) {
      const updatedCell = await response.json();
      setCells((prevCells) => {
        const updatedCells = prevCells.map((cell) => {
          if (cell.row === updatedCell.row && cell.col === updatedCell.col) {
            return updatedCell;
          }
          return cell;
        });

        if (!prevCells.find((cell) => cell.row === updatedCell.row && cell.col === updatedCell.col)) {
          updatedCells.push(updatedCell);
        }

        return updatedCells;
      });

      addToHistory(updatedCell);
      setEditing({ row: null, col: null, value: '' });
    } else {
      console.error('Failed to save cell');
    }
  };

  const addToHistory = (updatedCell) => {
    const newHistory = [...history.slice(0, currentHistoryIndex + 1), [...cells]];
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = async () => {
    if (currentHistoryIndex > 0) {
      const previousCells = history[currentHistoryIndex - 1];
      setCells(previousCells);
      setCurrentHistoryIndex(currentHistoryIndex - 1);
    }
  };

  const handleRedo = async () => {
    if (currentHistoryIndex < history.length - 1) {
      const nextCells = history[currentHistoryIndex + 1];
      setCells(nextCells);
      setCurrentHistoryIndex(currentHistoryIndex + 1);
    }
  };

  const renderGrid = () => {
    const grid = [];
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        const cell = cells.find((cell) => cell.row === row && cell.col === col);
        grid.push(
          <div
            key={`${row}-${col}`}
            className={`cell`}
            ref={(el) => (cellRefs.current[`${row}-${col}`] = el)}
            onClick={() => setEditing({ row, col, value: cell ? cell.value : '' })}
            style={{
              gridRowStart: row + 1,
              gridColumnStart: col + 1,
              border: '1px solid #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: (row + col) % 2 === 0 ? '#f4f4f4' : '#fff',
              cursor: 'pointer',
            }}
            onMouseEnter={() => handleCellHover(row, col)}
            onMouseLeave={() => handleCellHoverLeave(row, col)}
          >
            {editing.row === row && editing.col === col ? (
              <input
                type="text"
                value={editing.value}
                onChange={(e) => handleCellChange(e, row, col)}
                onBlur={() => handleCellSave(row, col)}
                autoFocus
                className="cell-input"
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <span>{cell ? cell.value : ''}</span>
            )}
          </div>
        );
      }
    }
    return grid;
  };

  const handleCellHover = (row, col) => {
    const cell = cellRefs.current[`${row}-${col}`];
    gsap.to(cell, {
      scale: 1.05,
      boxShadow: "0px 4px 12px rgba(0, 123, 255, 0.6)",
      duration: 0.3,
    });
  };

  const handleCellHoverLeave = (row, col) => {
    const cell = cellRefs.current[`${row}-${col}`];
    gsap.to(cell, {
      scale: 1,
      boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.1)",
      duration: 0.3,
    });
  };

  return (
    <div className="spreadsheet-container">
      <h1>Interactive 2D Spreadsheet with GSAP Animations</h1>

      {/* Buttons for Undo and Redo */}
      <button onClick={handleUndo} disabled={currentHistoryIndex === 0}>Undo</button>
      <button onClick={handleRedo} disabled={currentHistoryIndex === history.length - 1}>Redo</button>

      {/* Grid */}
      <div
        className="spreadsheet"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
          gap: '2px',
          width: '80%',
          margin: '20px auto',
        }}
      >
        {renderGrid()}
      </div>

      {/* Optional: Canvas for Dynamic Effects */}
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls />
        <Plane args={[5, 5]} position={[0, 0, -1]} />
      </Canvas>
    </div>
  );
};

export default App;
