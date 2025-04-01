-- finde users who have attempted more than 20 questions but have an accuracy below 30%
SELECT 
    u.username,
    COUNT(gsq.question_id) AS total_attempts,
    SUM(CASE WHEN gsq.is_correct THEN 1 ELSE 0 END) AS correct_answers,
    ROUND(100.0 * SUM(CASE WHEN gsq.is_correct THEN 1 ELSE 0 END) / COUNT(gsq.question_id), 2) AS accuracy_percentage
FROM User u
JOIN GameSession gs ON u.user_id = gs.user_id
JOIN GameSessionQuestion gsq ON gs.session_id = gsq.session_id
GROUP BY u.user_id, u.username
HAVING COUNT(gsq.question_id) > 20
   AND (100.0 * SUM(CASE WHEN gsq.is_correct THEN 1 ELSE 0 END) / COUNT(gsq.question_id)) < 30
ORDER BY accuracy_percentage ASC
LIMIT 15;
