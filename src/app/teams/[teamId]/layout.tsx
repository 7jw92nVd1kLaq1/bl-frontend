'use client';

import { createContext } from 'react';
import { createStore } from 'zustand';

import TeamHeader from "@/components/team-page/TeamHeader";
import TeamSectionOptions from "@/components/team-page/TeamSectionOptions";
import { useSuspenseQuery } from '@tanstack/react-query';
import { getTeamGeneralInfo } from '@/api/team.api';


interface ITeamStore {
  currentScheduleFilterValue: string;
  updateCurrentScheduleFilterValue: (value: string) => void;
  playersFilterValue: string;
  updatePlayersFilterValue: (value: string) => void;
  currentPlayerId: number | null;
  updateCurrentPlayerId: (id: number | null) => void;
}

export type TSection = "general-info" | "players" | "schedule" | "posts";

const TeamStore = createStore<ITeamStore>((set) => ({
  currentScheduleFilterValue: "0",
  updateCurrentScheduleFilterValue: (value) => set({ currentScheduleFilterValue: value }),
  playersFilterValue: "A",
  updatePlayersFilterValue: (value) => set({ playersFilterValue: value }),
  currentPlayerId: null,
  updateCurrentPlayerId: (id) => set({ currentPlayerId: id }),
}));

export const TeamStoreContext = createContext(TeamStore);

export default function TeamsPage({ params, children }: { 
  params: { teamId: string }, 
  children: React.ReactNode }
) {
  const headerQuery = useSuspenseQuery({
    queryKey: ["team", params.teamId], 
    queryFn: async () => {
      return await getTeamGeneralInfo(params.teamId);
    }
  });

  return (
    <TeamStoreContext.Provider value={TeamStore}>
      <div className="mx-[256px] my-[32px] flex flex-col items-stretch gap-[24px]">
        <h1 className="text-white text-[32px] font-bold">팀 페이지</h1>
        <TeamHeader team={headerQuery.data} />
        <TeamSectionOptions />
        {children}
      </div>
    </TeamStoreContext.Provider>
  );
}