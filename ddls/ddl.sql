CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE Category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE Question (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    question_text TEXT NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    option1 VARCHAR(255) NOT NULL,
    option2 VARCHAR(255) NOT NULL,
    option3 VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
    FOREIGN KEY (category_id) REFERENCES Category(category_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE GameSession (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    time_elapsed INT DEFAULT 0,
    score INT DEFAULT 0,
    num_correct INT DEFAULT 0,
    attempts INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE GameSessionQuestion (
    session_id INT NOT NULL,
    question_id INT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    PRIMARY KEY (session_id, question_id),
    FOREIGN KEY (session_id) REFERENCES GameSession(session_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (question_id) REFERENCES Question(question_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);