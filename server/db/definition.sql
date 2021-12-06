DROP DATABASE IF EXISTS lie_to_db;
CREATE DATABASE lie_to_db;
USE lie_to_db;

CREATE TABLE users (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	google_id VARCHAR(100) UNIQUE,
    email VARCHAR(100) UNIQUE,
    nickname VARCHAR(100)
);
SELECT * FROM users;

CREATE TABLE diagnosis (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    created_date DATETIME,
    final_result BOOLEAN,
    eye_movement_result FLOAT,
    voice_signal_result FLOAT,
    bpm_result FLOAT,
    hit_probability FLOAT,
    was_right BOOLEAN,
    
	FOREIGN KEY (user_id) REFERENCES users(id)
);
SELECT * FROM diagnosis;

CREATE TABLE user_baseline_variables (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    bpm FLOAT,
    eye_movement FLOAT,
    voice_signal FLOAT,
    
	FOREIGN KEY (user_id) REFERENCES users(id)
);
SELECT * FROM user_baseline_variables;














DELIMITER //
CREATE PROCEDURE save_user(
    google_id  VARCHAR(100),
    email VARCHAR(100),
    nickname VARCHAR(100)
)
BEGIN
    INSERT INTO users VALUES (null, google_id, email, nickname);
END //
DELIMITER ;
CALL save_user('Gera', 'TEST', 'email@gerardoarceo.com');





DROP PROCEDURE IF EXISTS save_user_baseline_variables;
DELIMITER //
CREATE PROCEDURE save_user_baseline_variables(
    _google_id  VARCHAR(100),
	_bpm FLOAT,
    _eye_movement FLOAT,
    _voice_signal FLOAT
)
BEGIN
    DECLARE _user_id BIGINT DEFAULT (SELECT id FROM users WHERE google_id = _google_id);
    DECLARE _id BIGINT DEFAULT (SELECT id FROM user_baseline_variables WHERE user_id = _user_id);
	if (_id IS NULL) THEN
		INSERT INTO user_baseline_variables VALUES (null, _user_id, _bpm, _eye_movement, _voice_signal);
	ELSE
		UPDATE user_baseline_variables SET bpm = _bpm, eye_movement = _eye_movement, voice_signal = _voice_signal WHERE id = _id;
	END IF;
END //
DELIMITER ;
CALL save_user_baseline_variables('TEST', 80, 100, 100);






DROP PROCEDURE IF EXISTS save_diagnosis;
DELIMITER //
CREATE PROCEDURE save_diagnosis(
    _google_id  VARCHAR(100),
    final_result BOOLEAN,
    eye_movement_result FLOAT,
    voice_signal_result FLOAT,
    bpm_result FLOAT,
    hit_probability FLOAT
)
BEGIN
    DECLARE _user_id BIGINT DEFAULT (SELECT id FROM users WHERE google_id = _google_id);
    INSERT INTO diagnosis VALUES (null, _user_id,NOW(),final_result,eye_movement_result,voice_signal_result,bpm_result,hit_probability,NULL);
END //
DELIMITER ;
CALL save_diagnosis('TEST', true, 50, 50, 50, 100);













DROP PROCEDURE IF EXISTS update_diagnosis_result;
DELIMITER //
CREATE PROCEDURE update_diagnosis_result(
    _google_id  VARCHAR(100),
    _was_right BOOLEAN
)
BEGIN
	DECLARE _user_id BIGINT DEFAULT (SELECT id FROM users WHERE google_id = _google_id);
	DECLARE _diagnosis_id BIGINT DEFAULT (SELECT id FROM diagnosis WHERE user_id = _user_id ORDER BY id DESC LIMIT 1);
	UPDATE diagnosis SET was_right = _was_right WHERE id = _diagnosis_id;
END //
DELIMITER ;
CALL update_diagnosis_result('TEST', true);
















DROP PROCEDURE IF EXISTS get_user_baseline_variables;
DELIMITER //
CREATE PROCEDURE get_user_baseline_variables(
    _google_id  VARCHAR(100)
)
BEGIN
	DECLARE _user_id BIGINT DEFAULT (SELECT id FROM users WHERE google_id = _google_id);
	SELECT * FROM user_baseline_variables WHERE user_id = _user_id;
END //
DELIMITER ;
CALL get_user_baseline_variables('TEST');







DROP PROCEDURE IF EXISTS get_user_diagnosis;
DELIMITER //
CREATE PROCEDURE get_user_diagnosis(
    _google_id  VARCHAR(100)
)
BEGIN
	DECLARE _user_id BIGINT DEFAULT (SELECT id FROM users WHERE google_id = _google_id);
	SELECT * FROM diagnosis WHERE user_id = _user_id;
END //
DELIMITER ;
CALL get_user_diagnosis('TEST');

