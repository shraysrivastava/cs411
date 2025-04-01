SELECT
    u.username,
    total_scores.total_score,
    total_scores.total_sessions,
    ROUND(total_scores.total_score / total_scores.total_sessions, 2) AS avg_score_per_session
FROM (
    SELECT
        g.user_id,
        SUM(g.score) AS total_score,
        COUNT(*) AS total_sessions
    FROM GameSession g
    GROUP BY g.user_id
) AS total_scores
JOIN User u ON total_scores.user_id = u.user_id
ORDER BY total_scores.total_score DESC
LIMIT 15;
