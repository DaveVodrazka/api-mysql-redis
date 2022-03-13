# Create tables if they don't exist
CREATE TABLE IF NOT EXISTS Authors (
  authorId INT AUTO_INCREMENT,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (authorId)
);

CREATE TABLE IF NOT EXISTS Posts (
  id INT AUTO_INCREMENT,
  authorId INT,
  title VARCHAR(255) NOT NULL,
  firstParagraph VARCHAR(255) NOT NULL,
  article TEXT NOT NULL,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (authorId) REFERENCES Authors(authorId)
);

# Populate tables if they are empty
INSERT INTO Authors (firstName, lastName)
SELECT * FROM (SELECT 'Hermione' firstName, 'Granger' lastName UNION ALL
               SELECT 'Harry', 'Potter' UNION ALL
               SELECT 'Ron', 'Weasley' UNION ALL
               SELECT 'Tom', 'Raddle' UNION ALL
               SELECT 'Arthur', 'Weasley') data
WHERE NOT EXISTS (SELECT * FROM Authors);

INSERT INTO Posts (authorId, title, firstParagraph, article)
SELECT * FROM (SELECT 1 a, 'Welcome to Hogwarts' b, '100 points to Griffindor!' c, 'Quiditch is Famfrpal in Czech.' d UNION ALL
               SELECT 1, 'Child who lived', 'Fascinating story of me.', 'Yes, I am the child who lived.' UNION ALL
               SELECT 3, 'Bertie Botts', 'I love \'em!', 'Also, I hate Snape.' UNION ALL
               SELECT 4, 'Basilisk', 'Slyest animal in Hogwarts.', 'Also venomous (not poisonous).') data
WHERE NOT EXISTS (SELECT * FROM Posts);
