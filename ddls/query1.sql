
-- Calculate Average score and accuracy vy difficulty level per user
SELECT 
    u.username,
    q.difficulty,
    COUNT(gsq.question_id) AS total_attempts,
    SUM(CASE WHEN gsq.is_correct THEN 1 ELSE 0 END) AS correct_answers,
    ROUND(AVG(gs.score), 2) AS avg_score,
    ROUND(100.0 * SUM(CASE WHEN gsq.is_correct THEN 1 ELSE 0 END) / COUNT(gsq.question_id), 2) AS accuracy_percentage
FROM User u
JOIN GameSession gs ON u.user_id = gs.user_id
JOIN GameSessionQuestion gsq ON gs.session_id = gsq.session_id
JOIN Question q ON gsq.question_id = q.question_id
GROUP BY u.username, q.difficulty
ORDER BY u.username, q.difficulty
LIMIT 15;

