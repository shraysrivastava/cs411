'use client';

import { useState, useEffect } from "react";
import LeaderboardTable from "@/components/leaderboard-table";

type LeaderboardEntry = {
    username: string;
    total_score: number;
    total_sessions: number;
    avg_score_per_session: number;
  };

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch(`http://localhost:8080/get-leaderboard`, {
          cache: "no-store",
        });
        const leaderboardData = await res.json();
        setData(leaderboardData);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      }
    }

    fetchLeaderboard();
  }, []);

  const filteredData = data.filter((entry) =>
    entry.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container flex flex-col items-center py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">Leaderboard</h1>

      <input
        type="text"
        placeholder="Search username..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full max-w-md rounded-md border px-4 py-2"
      />

      <LeaderboardTable data={filteredData} />
    </div>
  );
}
