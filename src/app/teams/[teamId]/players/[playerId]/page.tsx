'use client'

import { getPlayerCareerStats, getPlayerLast5GamesStats, getPlayerSeasonStats, getPlayersFromTeam } from "@/api/player.api";
import TeamPlayersPlayerDetailsCareerStats from "@/components/team-page/TeamPlayersPlayerDetailsCareerStats";
import TeamPlayersPlayerDetailsGameStats from "@/components/team-page/TeamPlayersPlayerDetailsGameStats";
import TeamPlayersPlayerDetailsSeasonStats from "@/components/team-page/TeamPlayersPlayerDetailsSeasonStats";
import { Player } from "@/models/player.models";
import { getPositionInKoreanFromAbbreviation } from "@/utils/player.utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";


const TeamPlayersPlayerDetails = () => {
  const { teamId, playerId } = useParams();
  const teamPlayersQuery = useSuspenseQuery({
    queryKey: ["team", teamId, "players"],
    queryFn: async () => {
      return await getPlayersFromTeam(teamId as string);
    }
  });

  const playerSeasonStatsQuery = useSuspenseQuery({
    queryKey: ["player", playerId, "season-stats"],
    queryFn: async () => {
      return await getPlayerSeasonStats(teamId as string, playerId as string);
    }
  });

  const playerLast5GamesStatsQuery = useSuspenseQuery({
    queryKey: ["player", playerId, "last-5-games-stats"],
    queryFn: async () => {
      return await getPlayerLast5GamesStats(teamId as string, playerId as string);
    }
  });

  const playerCareerStatsQuery = useSuspenseQuery({
    queryKey: ["player", playerId, "career-stats"],
    queryFn: async () => {
      return await getPlayerCareerStats(teamId as string, playerId as string);
    }
  });

  const selectedPlayer = teamPlayersQuery.data.find(player => player.PERSON_ID === Number(playerId)) as Player;
  const playerPosition = getPositionInKoreanFromAbbreviation(selectedPlayer.POSITION);

  const handleGoBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.history.back();
  };

  return (
    <div className="flex flex-col gap-[24px] items-stretch">
      <button className="text-white bg-color1 py-[12px] px-[32px] rounded-full w-fit" onClick={handleGoBackClick}>
        👈 선수 목록으로 돌아가기
      </button>
      <div className="flex items-start justify-between overflow-x-auto gap-[48px]">
        <div className="flex gap-[48px] item-start shrink-0 grow">
          <div className="w-[128px] h-[128px] overflow-hidden bg-white relative rounded-full">
            <Image
              className="w-[100%] h-auto absolute bottom-0"
              src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${selectedPlayer.PERSON_ID}.png`}
              alt="player-image"
              width={1040}
              height={760}
            />
          </div> 
          {/* Team Name */}
          <div className="flex flex-col gap-[16px] w-min grow">
            <div className="flex items-center gap-[24px]">
              <h1 className="text-white text-[40px] font-medium">#{selectedPlayer.JERSEY_NUMBER || '-'}</h1>
              <div className="flex flex-col items-start gap-[4px]">
                <h1 className="text-white text-[24px]">{selectedPlayer.PLAYER_FIRST_NAME}</h1>
                <h1 className="text-white text-[24px] font-bold">{selectedPlayer.PLAYER_LAST_NAME}</h1>
              </div>
            </div>
            <div className="flex items-center gap-[16px] flex-wrap grow">
              <div className="px-[32px] py-[4px] rounded-full bg-color3">
                <p className="text-[14px] text-white font-bold">{playerPosition}</p>
              </div>
              <div className="px-[32px] py-[4px] rounded-full bg-color3">
                <p className="text-[14px] text-white font-bold">{selectedPlayer.HEIGHT}</p>
              </div>
              <div className="px-[32px] py-[4px] rounded-full bg-color3">
                <p className="text-[14px] text-white font-bold">{selectedPlayer.WEIGHT} lbs</p>
              </div>
              <div className="px-[32px] py-[4px] rounded-full bg-color3">
                <p className="text-[14px] text-white font-bold">{selectedPlayer.COUNTRY}</p>
              </div>
              <div className="px-[32px] py-[4px] rounded-full bg-color3">
                <p className="text-[14px] text-white font-bold">{selectedPlayer.COLLEGE}</p>
              </div>
              {selectedPlayer.DRAFT_YEAR && (
              <div className="px-[32px] py-[4px] rounded-full bg-color3">
                <p className="text-[14px] text-white font-bold">{selectedPlayer.DRAFT_YEAR}년 드래프트</p>
              </div>
              )}
              {selectedPlayer.DRAFT_ROUND && selectedPlayer.DRAFT_NUMBER && (
              <div className="px-[32px] py-[4px] rounded-full bg-color3">
                <p className="text-[14px] text-white font-bold">{selectedPlayer.DRAFT_ROUND}라운드 {selectedPlayer.DRAFT_NUMBER}순위 지명</p>
              </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-color3 rounded-lg text-[16px] p-[12px] font-medium flex gap-[12px]">
          <Image
            src={"/icons/favorite_border_24dp_FFFFFF.svg"}
            alt="favorite"
            width={24}
            height={24}
          />
          24
        </div>
      </div>
      <div>
        <h3 className="text-white text-[20px] font-bold">2024-25 시즌 스탯</h3>
        <TeamPlayersPlayerDetailsSeasonStats stats={playerSeasonStatsQuery.data} />
      </div>
      <div>
        <h3 className="text-white text-[20px] font-bold">지난 5경기 스탯</h3>
        <TeamPlayersPlayerDetailsGameStats stats={playerLast5GamesStatsQuery.data} />
      </div>
      <div>
        <h3 className="text-white text-[20px] font-bold">선수 커리어 스탯</h3>
        <TeamPlayersPlayerDetailsCareerStats stats={playerCareerStatsQuery.data} />
      </div>
    </div>
  )
}

export default TeamPlayersPlayerDetails;