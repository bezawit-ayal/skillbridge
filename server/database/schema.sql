CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    company VARCHAR(200) NOT NULL,
    location VARCHAR(200) NULL,
    job_type VARCHAR(100) NULL,
    salary VARCHAR(120) NULL,
    job_url TEXT NULL,
    description TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX jobs_created_at_idx (created_at),
    INDEX jobs_location_idx (location),
    INDEX jobs_job_type_idx (job_type)
);

CREATE TABLE IF NOT EXISTS applications (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    job_id INT NULL,
    company VARCHAR(200) NOT NULL,
    position VARCHAR(200) NOT NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'Applied',
    location VARCHAR(200) NULL,
    salary VARCHAR(120) NULL,
    job_type VARCHAR(100) NULL,
    job_url TEXT NULL,
    notes TEXT NULL,
    applied_date DATE NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX applications_user_created_idx (user_id, created_at),
    INDEX applications_user_job_idx (user_id, job_id),
    CONSTRAINT applications_user_fk FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT applications_job_fk FOREIGN KEY (job_id)
        REFERENCES jobs (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS saved_jobs (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY saved_jobs_user_job_unique (user_id, job_id),
    CONSTRAINT saved_jobs_user_fk FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT saved_jobs_job_fk FOREIGN KEY (job_id)
        REFERENCES jobs (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_profiles (
    user_id INT NOT NULL PRIMARY KEY,
    profile_data JSON NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT user_profiles_user_fk FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_settings (
    user_id INT NOT NULL PRIMARY KEY,
    settings_data JSON NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT user_settings_user_fk FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS interviews (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    application_id INT NULL,
    type VARCHAR(120) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration SMALLINT UNSIGNED NOT NULL DEFAULT 60,
    meeting_url TEXT NULL,
    notes TEXT NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'Upcoming',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX interviews_user_schedule_idx (user_id, date, time),
    CONSTRAINT interviews_user_fk FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT interviews_application_fk FOREIGN KEY (application_id)
        REFERENCES applications (id) ON DELETE SET NULL
);