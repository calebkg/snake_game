
import React, { useRef, useEffect, useCallback } from 'react';
import { useSnakeGame } from '../hooks/useSnakeGame';
import { Button } from './ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

const CANVAS_SIZE = 400;
const GRID_SIZE = 20;

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    snake,
    food,
    direction,
    score,
    gameState,
    startGame,
    pauseGame,
    resetGame,
    changeDirection
  } = useSnakeGame();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid lines
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw snake
    ctx.fillStyle = '#00ff00';
    snake.forEach((segment, index) => {
      if (index === 0) {
        // Head is brighter
        ctx.fillStyle = '#00ff88';
      } else {
        ctx.fillStyle = '#00cc66';
      }
      ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    });

    // Draw food
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
  }, [snake, food]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          changeDirection('UP');
          break;
        case 'ArrowDown':
          e.preventDefault();
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
          e.preventDefault();
          changeDirection('RIGHT');
          break;
        case ' ':
          e.preventDefault();
          if (gameState === 'playing') {
            pauseGame();
          } else if (gameState === 'paused') {
            startGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [changeDirection, gameState, pauseGame, startGame]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="bg-gray-900 rounded-lg p-6 shadow-2xl border border-gray-700">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-green-400 mb-2">SNAKE GAME</h1>
          <div className="text-2xl font-mono text-white">Score: {score}</div>
        </div>

        <div className="relative mb-4">
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="border-2 border-green-400 rounded bg-gray-800"
          />
          
          {gameState === 'gameOver' && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-red-400 mb-2">GAME OVER</h2>
                <p className="text-white mb-4">Final Score: {score}</p>
                <Button onClick={resetGame} className="bg-green-600 hover:bg-green-700">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </div>
            </div>
          )}

          {gameState === 'paused' && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">PAUSED</h2>
                <p className="text-white text-sm">Press Space or click Play to continue</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {gameState === 'waiting' && (
            <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Start Game
            </Button>
          )}
          
          {gameState === 'playing' && (
            <Button onClick={pauseGame} className="bg-yellow-600 hover:bg-yellow-700">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          
          {gameState === 'paused' && (
            <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Resume
            </Button>
          )}
          
          <Button onClick={resetGame} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="text-center text-sm text-gray-400">
          <p>Use arrow keys to control the snake</p>
          <p>Press Space to pause/resume</p>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
