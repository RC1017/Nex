/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Gamepad2, Trophy, Ghost, Puzzle, Gamepad, X, Maximize2, RotateCcw, Home } from 'lucide-react';
import { GAMES } from './data/games';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const playerRef = useRef(null);

  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const filteredGames = useMemo(() => {
    return GAMES.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const categories = ['All', 'Action', 'Puzzle', 'Strategy', 'Arcade', 'Retro'];

  return (
    <div className="min-h-screen bg-brand-bg text-white font-sans flex border-[8px] border-brand-border">
      {/* Sidebar Navigation */}
      <aside className="w-[80px] border-r border-brand-border flex flex-col items-center py-10 gap-16 sticky top-0 h-[calc(100vh-16px)]">
        <div 
          className="w-10 h-10 bg-brand-accent flex items-center justify-center cursor-pointer mb-4"
          onClick={() => setSelectedGame(null)}
        >
          <Gamepad2 className="text-black w-6 h-6" />
        </div>
        
        <div className="flex flex-col gap-12">
          {['Discovery', 'Trending', 'Multiplayer', 'Old School'].map((label) => (
            <button 
              key={label}
              className={`vertical-text uppercase font-black text-sm tracking-[0.3em] transition-colors ${
                label === 'Discovery' ? 'text-brand-accent' : 'text-brand-muted hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-10 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="catalog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full"
            >
              <header className="flex justify-between items-end mb-12">
                <div>
                  <h1 className="font-display text-[80px] leading-[0.8] tracking-[-0.04em] uppercase">
                    Nex<br />Play
                  </h1>
                </div>
                <div className="flex flex-col items-end gap-2 stats font-display text-xs tracking-wider uppercase">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-brand-accent animate-pulse" />
                    <span>4,209 PLAYERS LIVE</span>
                  </div>
                  <div className="relative w-64 h-8">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-muted w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="SEARCH_SYSTEM_v4"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-full bg-transparent border border-brand-border pl-8 pr-2 focus:border-brand-accent outline-none text-[10px] tracking-widest uppercase font-sans transition-colors"
                    />
                  </div>
                </div>
              </header>

              {/* Category Filter */}
              <div className="flex gap-4 mb-8">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 border transition-all ${
                      activeCategory === cat 
                      ? 'bg-brand-accent text-black border-brand-accent' 
                      : 'border-brand-border text-brand-muted hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Game Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow anonymous-scroll overflow-y-auto pr-2">
                {filteredGames.map((game, idx) => (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                    onPlay={() => setSelectedGame(game)} 
                    index={idx + 1}
                  />
                ))}
              </div>

              <footer className="mt-12 flex justify-between items-center border-top border-brand-border pt-6 text-[11px] font-sans uppercase tracking-widest text-zinc-600">
                <div>v4.0.2 / Terminal System Active</div>
                <div>&copy; 2026 NEXPLAY UNBLOCKED PORTAL</div>
                <div>Secure Protocol Enabled</div>
              </footer>
            </motion.div>
          ) : (
            <motion.div
              key="player"
              ref={playerRef}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-[40px] z-50 bg-black flex flex-col border border-brand-border"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-brand-border bg-brand-bg">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-muted hover:text-brand-accent transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    <span>BACK_TO_TERMINAL</span>
                  </button>
                  <div className="h-4 w-[1px] bg-brand-border" />
                  <h3 className="font-display text-sm tracking-tighter uppercase">{selectedGame.title}</h3>
                </div>
                
                <div className="flex items-center gap-4">
                  <button className="text-brand-muted hover:text-white transition-colors">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button 
                    className="text-brand-muted hover:text-white transition-colors"
                    onClick={toggleFullscreen}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button 
                    className="ml-4 bg-brand-accent text-black px-4 py-1 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors"
                    onClick={() => setSelectedGame(null)}
                  >
                    CLOSE_APP
                  </button>
                </div>
              </div>
              
              <div className="flex-1 bg-black">
                <iframe 
                  src={selectedGame.url}
                  className="w-full h-full border-none grayscale-[0.2] hover:grayscale-0 transition-all"
                  title={selectedGame.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

const GameCard = ({ 
  game, 
  onPlay, 
  index
}) => {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer relative border border-brand-border p-6 flex flex-col justify-between h-[320px] bg-zinc-900/10 hover:bg-brand-accent transition-all duration-300"
      onClick={onPlay}
    >
      <div className="flex justify-between items-start z-10">
        <span className="text-[10px] font-black tracking-widest text-brand-muted group-hover:text-black transition-colors uppercase">
          ID: {index.toString().padStart(3, '0')}
        </span>
        <span className="text-[10px] font-black tracking-widest border border-brand-border group-hover:border-black px-2 py-0.5 group-hover:text-black transition-colors uppercase">
          {game.category}
        </span>
      </div>

      <div className="relative w-full h-[140px] border border-brand-border group-hover:border-black/20 overflow-hidden bg-brand-bg transition-colors">
        <img 
          src={game.thumbnail} 
          alt={game.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
          <Gamepad className="text-black w-10 h-10 animate-bounce" />
        </div>
      </div>

      <div className="z-10">
        <h3 className="font-display text-2xl uppercase leading-none tracking-tight group-hover:text-black transition-colors">
          {game.title}
        </h3>
      </div>

      <div className="absolute bottom-[-10px] right-2 font-display text-[60px] text-zinc-900 group-hover:text-black/5 select-none pointer-events-none transition-colors z-0">
        {index.toString().padStart(2, '0')}
      </div>
    </motion.div>
  );
}
