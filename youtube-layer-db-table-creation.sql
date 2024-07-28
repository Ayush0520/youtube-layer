-- Create the users table
CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    mobile_no VARCHAR(10) UNIQUE NOT NULL,
    user_type VARCHAR(255) NOT NULL
);

-- Create an index on mobile_no
CREATE INDEX idx_mobile_no ON users(mobile_no);
CREATE INDEX idx_email ON users(email);

CREATE TABLE videos (
    id INT PRIMARY KEY IDENTITY(1,1),
    editor_username VARCHAR(255) NOT NULL,
    youtuber_username VARCHAR(255) NOT NULL,
    file_path VARCHAR(MAX) NOT NULL,
    upload_date DATETIME DEFAULT GETDATE(),
    status VARCHAR(10) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    review_comments TEXT,
    FOREIGN KEY (editor_username) REFERENCES users(username),
    FOREIGN KEY (youtuber_username) REFERENCES users(username)
);

-- Additional index for status for faster query
CREATE INDEX idx_status ON videos(status);




CREATE TABLE collaborations (
    id INT PRIMARY KEY IDENTITY(1,1),
    sender_username VARCHAR(255) NOT NULL,
    receiver_username VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (sender_username) REFERENCES users(username),
    FOREIGN KEY (receiver_username) REFERENCES users(username)
);

CREATE INDEX idx_sender_username ON collaborations(sender_username);
CREATE INDEX idx_receiver_username ON collaborations(receiver_username);