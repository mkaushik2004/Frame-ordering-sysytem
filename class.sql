CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    age INT NOT NULL,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    session_type VARCHAR(50) NOT NULL,
    art_medium VARCHAR(50) NOT NULL,
    experience_level VARCHAR(50) NOT NULL,
    class_duration VARCHAR(50) NOT NULL,
    class_size VARCHAR(50) NOT NULL,
    budget VARCHAR(50) NOT NULL,
    learning_goals TEXT,
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
