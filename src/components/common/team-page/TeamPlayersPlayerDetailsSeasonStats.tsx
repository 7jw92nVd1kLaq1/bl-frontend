import { Player, PlayerCareerStats } from "@/models/player.models"
import { useSuspenseQuery } from "@tanstack/react-query";


interface ITeamPlayersPlayerDetailsSeasonStatsProps {
  stats: PlayerCareerStats;
}

const TeamPlayersPlayerDetailsSeasonStats : React.FC<ITeamPlayersPlayerDetailsSeasonStatsProps> = ({ stats }) => {
  return (
    <div className="mt-[16px] flex p-[24px] bg-color3 rounded-md justify-between items-center">
      <div className="text-center">
        <p className="text-[16px]">GP</p>
        <p className="text-[24px] font-medium mt-[4px]">{stats.PTS || '0.0'}</p>
      </div>
      <div className="text-center">
        <p className="text-[16px]">PTS</p>
        <p className="text-[24px] font-medium mt-[4px]">{stats.PTS || '0.0'}</p>
      </div>
      <div className="text-center">
        <p className="text-[16px]">AST</p>
        <p className="text-[24px] font-medium mt-[4px]">{stats.AST || '0.0'}</p>
      </div>
      <div className="text-center">
        <p className="text-[16px]">REB</p>
        <p className="text-[24px] font-medium mt-[4px]">{stats.REB || '0.0'}</p>
      </div>
      <div className="text-center">
        <p className="text-[16px]">STL</p>
        <p className="text-[24px] font-medium mt-[4px]">{stats.PTS || '0.0'}</p>
      </div>
      <div className="text-center">
        <p className="text-[16px]">BLK</p>
        <p className="text-[24px] font-medium mt-[4px]">{stats.PTS || '0.0'}</p>
      </div>
      <div className="text-center">
        <p className="text-[16px]">FG%</p>
        <p className="text-[24px] font-medium mt-[4px]">{stats.PTS || '0.0'}</p>
      </div>
      <div className="text-center">
        <p className="text-[16px]">3P%</p>
        <p className="text-[24px] font-medium mt-[4px]">{stats.PTS || '0.0'}</p>
      </div>
      <div className="text-center">
        <p className="text-[16px]">FT%</p>
        <p className="text-[24px] font-medium mt-[4px]">{stats.PTS || '0.0'}</p>
      </div>
    </div>
  );
}

export default TeamPlayersPlayerDetailsSeasonStats;
  