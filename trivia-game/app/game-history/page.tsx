'use client';

import { useState, useEffect } from "react";

type GameSession = {
  session_id: number;
  time_elapsed: number;
  score: number;
  num_correct: number;
  attempts: number;
};

type Question = {
  question_text: string;
  is_correct: number;
};

export default function GameHistoryPage() {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [expandedSession, setExpandedSession] = useState<number | null>(null);
  const [questions, setQuestions] = useState<{ [key: number]: Question[] }>({});

  useEffect(() => {
    async function fetchSessions() {
        // const userId = currentUser?.user_id; // assuming you store currentUser after login
        // const res = await fetch(`http://localhost:8080/get-game-sessions?userId=${userId}`);
// Pranav lmk when you have user_id stored.
      const res = await fetch(`http://localhost:8080/get-game-sessions?userId=48`);
      const data = await res.json();
      setSessions(data);
    }
    fetchSessions();
  }, []);

  const toggleSession = async (sessionId: number) => {
    if (expandedSession === sessionId) {
      setExpandedSession(null); // collapse
    } else {
      if (!questions[sessionId]) {
        const res = await fetch(`http://localhost:8080/get-session-questions?sessionId=${sessionId}`);
        const data = await res.json();
        setQuestions(prev => ({ ...prev, [sessionId]: data }));
      }
      setExpandedSession(sessionId);
    }
  };

  return (
    <div className="container flex flex-col items-center py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">Game History</h1>
      <div className="w-full max-w-2xl space-y-4">
        {sessions.map(session => (
          <div key={session.session_id} className="border rounded-md p-4 shadow">
            <div className="flex justify-between items-center">
              <div>
                <p>Session ID: {session.session_id}</p>
                <p>Score: {session.score} | Correct: {session.num_correct}/{session.attempts} | Time: {session.time_elapsed}s</p>
              </div>
              <button
                onClick={() => toggleSession(session.session_id)}
                className="text-blue-600 underline"
              >
                {expandedSession === session.session_id ? "Hide Questions" : "Show Questions"}
              </button>
            </div>

            {expandedSession === session.session_id && (
              <div className="mt-4">
                {questions[session.session_id] ? (
                  <ul className="space-y-2">
                    {questions[session.session_id].map((q, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{q.question_text}</span>
                        <span className={q.is_correct ? "text-green-600" : "text-red-600"}>
                          {q.is_correct ? "Correct" : "Incorrect"}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Loading questions...</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
