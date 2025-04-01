-- compare which users have answered the most right per category
SELECT 
    c.name AS category_name,
    u.username,
    COUNT(*) AS correct_answers
FROM GameSessionQuestion gsq
JOIN Question q ON gsq.question_id = q.question_id
JOIN Category c ON q.category_id = c.category_id
JOIN GameSession gs ON gsq.session_id = gs.session_id
JOIN User u ON gs.user_id = u.user_id
WHERE gsq.is_correct = TRUE
GROUP BY c.name, u.username
HAVING COUNT(*) = (
    SELECT MAX(correct_count) FROM (
        SELECT COUNT(*) AS correct_count
        FROM GameSessionQuestion gsq2
        JOIN Question q2 ON gsq2.question_id = q2.question_id
        WHERE gsq2.is_correct = TRUE AND q2.category_id = c.category_id
        GROUP BY gsq2.session_id
    ) AS sub
)
LIMIT 15;
