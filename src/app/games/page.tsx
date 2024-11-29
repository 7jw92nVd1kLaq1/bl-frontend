'use client'

import AllGamesContainer from "@/components/game-page/AllGamesContainer";
import TodayGamesContainer from "@/components/home-page/TodayGamesContainer";
import { Suspense } from "react";


const allGamesPage = () => {
  return (
    <div className="my-[32px] flex flex-col items-stretch gap-[24px]">
      <h1 className="text-white text-[32px] font-bold">NBA 2024-25 시즌 스케쥴</h1>
      <TodayGamesContainer />
      <Suspense fallback={<div>Loading...</div>}>
        <AllGamesContainer />
      </Suspense>
    </div>
  );
}

export default allGamesPage;