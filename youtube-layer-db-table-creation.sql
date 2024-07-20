CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    mobile_no VARCHAR(15)
);

-- Additional index for email for faster search
CREATE INDEX idx_email ON users(email);

CREATE TABLE videos (
    video_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    uploader_username VARCHAR(255),
    file_path VARCHAR(MAX) NOT NULL,
    upload_date DATETIME DEFAULT GETDATE(),
    status VARCHAR(10) CHECK (status IN ('pending', 'approved', 'rejected')),
    review_comments TEXT,
    FOREIGN KEY (uploader_username) REFERENCES users(username)
);

-- Additional index for status for faster query
CREATE INDEX idx_status ON videos(status);