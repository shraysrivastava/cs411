import LeaderboardTable from "@/components/leaderboard-table";

export const metadata = {
  title: "Leaderboard - Guess Dat",
  description: "See the top players on Guess Dat!",
};

async function getLeaderboardData() {
  const res = await fetch(`http://localhost:8080/get-leaderboard`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch leaderboard");
  }

  return res.json();
}

export default async function LeaderboardPage() {
  const data = await getLeaderboardData();

  return (
    <div className="container flex flex-col items-center py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">Leaderboard</h1>
      <LeaderboardTable data={data} />
    </div>
  );
}
