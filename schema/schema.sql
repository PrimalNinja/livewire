CREATE TABLE d_sessions (
    session_id VARCHAR(64) PRIMARY KEY,
    session_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_updated_at ON d_sessions(updated_at);

CREATE TABLE d_system
(
    code  VARCHAR(20) NOT NULL,
    value VARCHAR(255),
    CONSTRAINT pk_d_system PRIMARY KEY (code)
);

insert into d_system (code, value) values ('DATABASENAME', 'Development Database');
