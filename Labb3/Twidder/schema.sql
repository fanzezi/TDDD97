CREATE TABLE [users](
  [email] VARCHAR(50),
  [password] VARCHAR(30),
  [firstname] VARCHAR(50),
  [familyname] VARCHAR(50),
  [gender] VARCHAR(6),
  [city] VARCHAR(50),
  [country] VARCHAR(50),
  PRIMARY KEY(email)
);

CREATE TABLE [loggedInUsers](
  [email] VARCHAR(50),
  [token] VARCHAR(30),
  PRIMARY KEY(email)
);

CREATE TABLE [messages](
  [messageId] INTEGER PRIMARY KEY autoincrement,
  [fromEmail] VARCHAR(50),
  [message] VARCHAR(250),
  [toEmail] VARCHAR(50)
);
