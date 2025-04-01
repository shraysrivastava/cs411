-- see who improved the most since their first and most recent game sessions
WITH FirstLastSessions AS (
    SELECT 
        user_id,
        MIN(session_id) AS first_session,
        MAX(session_id) AS last_session
    FROM GameSession
    GROUP BY user_id
),
SessionScores AS (
    SELECT 
        u.user_id,
        u.username,
        gs.session_id,
        gs.score
    FROM User u
    JOIN GameSession gs ON u.user_id = gs.user_id
),
ScoreImprovement AS (
    SELECT 
        f.user_id,
        u.username,
        first.score AS first_score,
        last.score AS last_score,
        (last.score - first.score) AS score_difference
    FROM FirstLastSessions f
    JOIN SessionScores first ON f.first_session = first.session_id
    JOIN SessionScores last ON f.last_session = last.session_id
    JOIN User u ON f.user_id = u.user_id
)
SELECT 
    username,
    first_score,
    last_score,
    score_difference,
    RANK() OVER (ORDER BY score_difference DESC) AS improvement_rank
FROM ScoreImprovement
WHERE score_difference > 0
LIMIT 15;
