import React from "react";

type LeaderboardEntry = {
  username: string;
  total_score: number;
  total_sessions: number;
  avg_score_per_session: number;
};

type LeaderboardTableProps = {
  data: LeaderboardEntry[];
};

export default function LeaderboardTable({ data }: LeaderboardTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border p-6 shadow-sm w-full">
      <table className="w-full table-auto text-left">
        <thead className="border-b">
          <tr>
            <th className="px-4 py-2">Rank</th>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Total Score</th>
            <th className="px-4 py-2">Sessions</th>
            <th className="px-4 py-2">Avg Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={entry.username} className="border-b">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{entry.username}</td>
              <td className="px-4 py-2">{entry.total_score}</td>
              <td className="px-4 py-2">{entry.total_sessions}</td>
              <td className="px-4 py-2">{entry.avg_score_per_session}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
