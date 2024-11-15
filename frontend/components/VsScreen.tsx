import React from "react";
import PlayerCard from "@/components/CardContainer";
import "@/styles/vsScreen.css";

interface PlayerCard {
  id: number;
  name: string;
  position: string;
  rating: number;
  club: string;
  nationality: string;
  stats: {
    pace: number;
    attack: number;
    passing: number;
    dribbling: number;
    defence: number;
    physical: number;
  };
}

interface VsScreenProps {
  player1Card: PlayerCard;
  player2Card: PlayerCard;
}

const VsScreen: React.FC<VsScreenProps> = ({ player1Card, player2Card }) => {
  return (
    <div className="fixed inset-0 z-50">
      {/* Background with pixel effect */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-20" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        {/* Left Card */}
        <div className="absolute left-1/2 transform -translate-x-[300px] vs-slide-right">
          <div className="relative transform -rotate-12 vs-card-pulse">
            <div className="absolute inset-0 bg-purple-500/30 blur-lg vs-glow" />
            <PlayerCard {...player1Card} type="left" />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-purple-300 font-mono text-xl tracking-widest">
              PLAYER 1
            </div>
          </div>
        </div>

        {/* VS Text */}
        <div className="relative z-10 transform vs-text-appear">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 blur-lg opacity-50" />
          <div className="relative flex flex-col items-center">
            <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-500 font-mono tracking-wider vs-text-shadow">
              VS
            </div>
            <div className="h-1 w-32 bg-gradient-to-r from-purple-500/0 via-purple-500 to-purple-500/0 mt-4 vs-line-appear" />
          </div>
        </div>

        {/* Right Card */}
        <div className="absolute left-1/2 transform translate-x-[100px] vs-slide-left">
          <div className="relative transform rotate-12 vs-card-pulse">
            <div className="absolute inset-0 bg-purple-500/30 blur-lg vs-glow" />
            <PlayerCard {...player2Card} type="right" />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-purple-300 font-mono text-xl tracking-widest">
              PLAYER 2
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Left Corner */}
          <div className="absolute top-8 left-8 w-32 h-32 border-l-4 border-t-4 border-purple-500/50 vs-corner-appear" />
          {/* Bottom Right Corner */}
          <div className="absolute bottom-8 right-8 w-32 h-32 border-r-4 border-b-4 border-purple-500/50 vs-corner-appear" />
        </div>

        {/* Lightning Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent vs-lightning"
              style={{
                left: `${25 + i * 15}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VsScreen;
