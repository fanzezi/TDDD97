/* contain the SQL script used to initialize the databas
*/
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS loggedInUser;
DROP TABLE IF EXISTS messages;

CREATE TABLE users (
  email varchar(50) NOT NULL,
  password varchar(50) NOT NULL,
  firstname varchar(50) NOT NULL,
  familyname varchar(50) NOT NULL,
  gender varchar(50) NOT NULL,
  city varchar(50) NOT NULL,
  country varchar(50) NOT NULL,
  PRIMARY KEY (email)
);

CREATE TABLE loggedInUser(
  email varchar(50) NOT NULL,
  token varchar(50),
  PRIMARY KEY (email)
);

CREATE TABLE messages(
  toEmail varchar(50) NOT NULL,
  fromEmail varchar(50) NOT NULL,
  message varchar(255)
);
