import React from "react";
import { Swords, Shield, Zap, Share2 } from "lucide-react";
import { countryToCode } from "@/util/constants";
import { teams } from "@/util/constants";
const colorSchemes = {
  classic: {
    left: "from-yellow-500 to-yellow-700",
    right: "from-green-500 to-green-700",
    statBar: "bg-white/40",
    text: "text-white",
    accent: "bg-black/70",
  },
  neon: {
    left: "from-pink-500 to-purple-700",
    right: "from-cyan-400 to-blue-600",
    statBar: "bg-white/60",
    text: "text-white",
    accent: "bg-black",
  },
  retro: {
    left: "from-orange-400 to-red-700",
    right: "from-teal-400 to-emerald-700",
    statBar: "bg-yellow-200/60",
    text: "text-yellow-100",
    accent: "bg-slate-900/90",
  },
  pastel: {
    left: "from-rose-300 to-pink-400",
    right: "from-sky-300 to-indigo-400",
    statBar: "bg-white/50",
    text: "text-white",
    accent: "bg-gray-800/80",
  },
  cyber: {
    left: "from-violet-500 to-fuchsia-700",
    right: "from-emerald-400 to-cyan-700",
    statBar: "bg-emerald-300/50",
    text: "text-emerald-100",
    accent: "bg-gray-900/95",
  },
};
type PlayerStats = {
  attack: number;
  defence: number;
  pace: number;
  passing: number;
};

type PlayerCardProps = {
  name?: string;
  position?: string;
  rating?: number;
  id?: number;
  club?: string;
  nationality?: string;
  stats?: {
    attack: number;
    defence: number;
    pace: number;
    passing: number;
  };
  type: "left" | "right";
  onClick?: () => void;
};
const getTeamIdFromTeams = (clubName: string) => {
  const team = teams.find(([_, name]) => name === clubName);
  return team ? team[2] : null; // Return the ID (third element) if found, null otherwise
};
const TeamLogo = ({ club }: { club: string }) => {
  const teamId = getTeamIdFromTeams(club);

  if (!teamId) {
    console.warn(`No team ID found for: ${club}`);
    return (
      <div className="relative w-6 h-6 flex items-center justify-center">
        <span className="text-xs text-white/60 font-mono">
          {club.slice(0, 3).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-8 h-8 overflow-hidden">
      <img
        src={`https://media.api-sports.io/football/teams/${teamId}.png`}
        width="24"
        height="24"
        alt={club}
        className="absolute inset-0 w-full h-full object-contain"
        style={{
          imageRendering: "pixelated",
          filter: "contrast(1.1) brightness(1.1)",
        }}
        onError={(e) => {
          e.currentTarget.style.display = "none";
          e.currentTarget.parentElement?.classList.add("fallback");
          console.warn(`Failed to load logo for: ${club} (ID: ${teamId})`);
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ9IjIiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')`,
          mixBlendMode: "multiply",
        }}
      />
      <span className="hidden fallback text-xs text-white/60 font-mono absolute inset-0 flex items-center justify-center">
        {club.slice(0, 3).toUpperCase()}
      </span>
    </div>
  );
};

const Flag = ({ country }: { country: string }) => {
  const code = countryToCode[country.toLowerCase()];

  if (!code) {
    console.warn(`No country code found for: ${country}`);
    return <span className="text-xs text-white/60 font-mono">{country}</span>;
  }

  return (
    <div className="relative w-6 h-4 overflow-hidden border border-black/20">
      <img
        src={`https://flagcdn.com/w40/${code}.png`}
        srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
        width="80"
        height="60"
        alt={country}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          imageRendering: "pixelated",
          filter: "contrast(1.1) saturate(1.2)",
        }}
        onError={(e) => {
          e.currentTarget.style.display = "none";
          e.currentTarget.parentElement?.classList.add("fallback");
          console.warn(`Failed to load flag for: ${country} (${code})`);
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ9IjIiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')`,
          mixBlendMode: "multiply",
        }}
      />
      <span className="hidden fallback text-xs text-white/60 font-mono absolute inset-0 flex items-center justify-center">
        {country.slice(0, 3).toUpperCase()}
      </span>
    </div>
  );
};

const PlayerCard = ({
  name = "",
  position = "",
  rating = 0,
  club = "",
  nationality = "",
  stats = { attack: 0, defence: 0, pace: 0, passing: 0 },
  type,
  onClick,
  theme = "neon",
}: PlayerCardProps & { theme?: keyof typeof colorSchemes }) => {
  const scheme = colorSchemes[theme];

  const getColor = () => {
    if (type === "left") return scheme.left;
    if (type === "right") return scheme.right;
    return "from-gray-500 to-gray-700";
  };

  const StatBar = ({
    value,
    icon,
  }: {
    value: number;
    icon: React.ReactNode;
  }) => (
    <div className="flex items-center gap-2">
      <div className={`${scheme.text}/80`}>{icon}</div>
      <div className="w-16 h-3 bg-black/30 relative overflow-hidden border border-white/20 group-hover:border-white/40 transition-colors">
        <div
          className={`h-full ${scheme.statBar} transition-all duration-300`}
          style={{
            width: `${value}%`,
            clipPath: "polygon(0 0, 100% 0, 95% 100%, 5% 100%)",
          }}
        />
      </div>
    </div>
  );

  return (
    <div
      onClick={onClick}
      className={`
        w-64 h-96 
        bg-gradient-to-br ${getColor()}
        rounded-none
        shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]
        hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]
        transform hover:translate-x-[-2px] hover:translate-y-[-2px]
        transition-all duration-200 
        cursor-pointer
        relative
        overflow-hidden
        border-4 border-black/20
      `}
    >
      <div className="absolute top-4 left-4">
        <div className="relative">
          <div className="absolute inset-0 bg-black/20 transform translate-x-1 translate-y-1" />
          <div className="bg-white p-2 flex items-center gap-2 relative">
            <span className="text-2xl font-bold text-gray-800 font-mono">
              {rating}
            </span>
            <span className="text-sm font-bold text-gray-800 font-mono">
              {position}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute top-5 left-1/2 transform -translate-x-1/2">
        <div className="relative">
          <div className="absolute inset-0 transform translate-x-1 translate-y-1" />
          <div className="w-64 h-64 flex items-center justify-center relative">
            {/* <Shield size={40} className={`${scheme.text}/70`} /> */}
            <img
              src={`/teams/${getTeamIdFromTeams(club)}.png`}
              alt={club}
              sizes="40"
            />
          </div>
        </div>
      </div>

      <div className={`absolute bottom-0 w-full ${scheme.accent} p-4`}>
        <div
          className={`${scheme.text} font-bold text-lg font-mono text-center mb-4 truncate px-2`}
        >
          {name}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex justify-center items-center gap-2">
            <TeamLogo club={club} />
          </div>
          <div className="flex justify-center items-center">
            <Flag country={nationality} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatBar value={stats.attack} icon={<Swords size={16} />} />
          <StatBar value={stats.defence} icon={<Shield size={16} />} />
          <StatBar value={stats.pace} icon={<Zap size={16} />} />
          <StatBar value={stats.passing} icon={<Share2 size={16} />} />
        </div>
      </div>

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50" />
    </div>
  );
};

export default PlayerCard;
