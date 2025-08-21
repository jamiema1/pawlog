--
-- Drop existing tables
--

DROP TABLE Communities CASCADE CONSTRAINTS;
DROP TABLE Users CASCADE CONSTRAINTS;
DROP TABLE BelongsTo CASCADE CONSTRAINTS;
DROP TABLE Achievements CASCADE CONSTRAINTS;
DROP TABLE Earns CASCADE CONSTRAINTS;
DROP TABLE Notifications CASCADE CONSTRAINTS;
DROP TABLE NotificationsContent CASCADE CONSTRAINTS;
DROP TABLE Pets CASCADE CONSTRAINTS;
DROP TABLE HasOwner CASCADE CONSTRAINTS;
DROP TABLE Posts CASCADE CONSTRAINTS;
DROP TABLE PostsContent CASCADE CONSTRAINTS;
DROP TABLE AdvicePosts CASCADE CONSTRAINTS;
DROP TABLE PetPosts CASCADE CONSTRAINTS;
DROP TABLE PetPostsIncludes CASCADE CONSTRAINTS;
DROP TABLE PostDetails CASCADE CONSTRAINTS;
DROP TABLE PostDetailsOrder CASCADE CONSTRAINTS;
DROP TABLE Tags CASCADE CONSTRAINTS;
DROP TABLE TaggedWith CASCADE CONSTRAINTS;
DROP TABLE Comments CASCADE CONSTRAINTS;
DROP TABLE CommentsContent CASCADE CONSTRAINTS;

--
-- Add tables
--

CREATE TABLE Communities(
    community_id INT,
    name VARCHAR2(50) NOT NULL UNIQUE,
    topic VARCHAR2(20) NOT NULL,
    description VARCHAR2(100),
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY (community_id)
);

CREATE TABLE Users(
    user_id INT,
    username VARCHAR2(20) NOT NULL UNIQUE,
    password VARCHAR2(20) NOT NULL,
    first_name VARCHAR2(20) NOT NULL,
    last_name VARCHAR2(20) NOT NULL,
    joined_at DATE NOT NULL,
    xp_value INT DEFAULT 0 NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE BelongsTo(
    community_id INT,
    user_id INT,
    PRIMARY KEY (community_id, user_id),
    FOREIGN KEY (community_id) REFERENCES Communities(community_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Achievements(
    achievement_id INT,
    achievement_name VARCHAR2(50) NOT NULL UNIQUE,
    xp_required INT DEFAULT 0 NOT NULL,
    PRIMARY KEY (achievement_id)
);

CREATE TABLE Earns(
    achievement_id INT,
    user_id INT,
    PRIMARY KEY (achievement_id, user_id),
    FOREIGN KEY (achievement_id) REFERENCES Achievements(achievement_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Notifications(
    notification_id INT,
    sent_at TIMESTAMP NOT NULL,
    is_read NUMBER(1) DEFAULT 0 NOT NULL,  -- 0 == FALSE, 1 == TRUE
    type VARCHAR2(20) NOT NULL,
    user_id INT NOT NULL,
    UNIQUE (sent_at, user_id),
    PRIMARY KEY (notification_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE NotificationsContent(
    sent_at TIMESTAMP,
    type VARCHAR2(20) NOT NULL,
    content VARCHAR2(100),
    user_id INT,
    PRIMARY KEY (sent_at, user_id),
    FOREIGN KEY (sent_at, user_id) REFERENCES Notifications(sent_at, user_id)
);

CREATE TABLE Pets(
    pet_id INT,
    name VARCHAR2(20) NOT NULL,
    birthday DATE NOT NULL,
    species VARCHAR2(20),
    PRIMARY KEY (pet_id),
    UNIQUE (name)
);

CREATE TABLE HasOwner(
    user_id INT,
    pet_id INT,
    PRIMARY KEY (user_id, pet_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id)
);

CREATE TABLE Posts(
    post_id INT,
    title VARCHAR2(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    likes INT DEFAULT 0 NOT NULL,
    thumbnail VARCHAR2(200) NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (post_id),
    UNIQUE (title, created_at, user_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE PostsContent(
    title VARCHAR2(50),
    content VARCHAR2(1000),
    created_at TIMESTAMP,
    user_id INT,
    PRIMARY KEY (title, created_at, user_id),
    FOREIGN KEY (title, created_at, user_id) REFERENCES Posts(title, created_at, user_id)
     ON DELETE CASCADE
);

CREATE TABLE AdvicePosts(
    post_id INT,
    advice_type VARCHAR2(20) NOT NULL,
    PRIMARY KEY (post_id),
    FOREIGN KEY (post_id) REFERENCES Posts(post_id)
     ON DELETE CASCADE
);

CREATE TABLE PetPosts(
    post_id INT,
    PRIMARY KEY (post_id),
    FOREIGN KEY (post_id) REFERENCES Posts(post_id)
     ON DELETE CASCADE
);

CREATE TABLE PetPostsIncludes(
    post_id INT,
    pet_id INT,
    PRIMARY KEY (post_id, pet_id),
    FOREIGN KEY (post_id) REFERENCES Posts(post_id)
      ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id)
);

CREATE TABLE PostDetails(
    postDetail_id INT,
    image_order INT,
    post_id INT,
    PRIMARY KEY (postDetail_id, post_id),
    UNIQUE (image_order, post_id),
    FOREIGN KEY (post_id) REFERENCES Posts(post_id)
      ON DELETE CASCADE
);

CREATE TABLE PostDetailsOrder(
    image_order INT,
    image_url VARCHAR2(200),
    post_id INT,
    PRIMARY KEY (image_order, post_id),
    FOREIGN KEY (image_order, post_id) REFERENCES PostDetails(image_order, post_id)
      ON DELETE CASCADE
);

CREATE TABLE Tags(
    tag_id INT,
    tag_name VARCHAR2(20) NOT NULL,
    PRIMARY KEY (tag_id)
);
CREATE TABLE TaggedWith(
    tag_id INT,
    post_id INT,
    PRIMARY KEY (tag_id, post_id),
    FOREIGN KEY (tag_id) REFERENCES Tags(tag_id),
    FOREIGN KEY (post_id) REFERENCES Posts(post_id)
      ON DELETE CASCADE
);

CREATE TABLE Comments(
    comment_id INT,
    created_at TIMESTAMP NOT NULL,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    PRIMARY KEY (comment_id),
    UNIQUE (created_at, user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (post_id) REFERENCES Posts(post_id)
      ON DELETE CASCADE
);

CREATE TABLE CommentsContent(
    content VARCHAR2(200) NOT NULL,
    created_at TIMESTAMP,
    user_id INT,
    post_id INT,
    PRIMARY KEY (created_at, user_id, post_id),
    FOREIGN KEY (created_at, user_id, post_id) REFERENCES Comments(created_at, user_id, post_id)
     ON DELETE CASCADE
);



--
-- Add tuples
--

-- Communities
INSERT INTO Communities VALUES (1, 'PawPals', 'Dogs', 'A friendly community for dog owners and lovers.', TO_TIMESTAMP('2024-06-01 10:00:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO Communities VALUES (2, 'MeowWorld', 'Cats', 'Share stories, tips, and pictures of your feline friends.', TO_TIMESTAMP('2024-06-05 14:30:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO Communities VALUES (3, 'CritterCorner', 'Small Pets', 'Hamsters, rabbits, guinea pigs — all small pets welcome!', TO_TIMESTAMP('2024-06-10 09:15:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO Communities VALUES (4, 'AquaSphere', 'Aquarium Pets', 'Discuss fish tanks, aquascaping, and aquatic pets.', TO_TIMESTAMP('2024-06-15 18:45:00', 'YYYY-MM-DD HH24:MI:SS'));
INSERT INTO Communities VALUES (5, 'FeatheredFam', 'Birds', 'For bird owners and enthusiasts of all feathered friends.', TO_TIMESTAMP('2024-06-20 12:00:00', 'YYYY-MM-DD HH24:MI:SS'));

-- Users
INSERT INTO Users VALUES (1, 'jlee', 'pass1234', 'Justin', 'Lee', TO_DATE('2024-06-01', 'YYYY-MM-DD'), 120);
INSERT INTO Users VALUES (2, 'jma', 'password', 'Jamie', 'Ma', TO_DATE('2024-06-15', 'YYYY-MM-DD'), 80);
INSERT INTO Users VALUES (3, 'mmamic', 'hello123', 'Michael', 'Mamic', TO_DATE('2024-07-01', 'YYYY-MM-DD'), 200);
INSERT INTO Users VALUES (4, 'user4', 'qwerty78', 'Dev', 'Patel', TO_DATE('2024-07-05', 'YYYY-MM-DD'), 50);
INSERT INTO Users (user_id, username, password, first_name, last_name, joined_at) VALUES (5, 'user5', 'mypassword', 'Emily', 'Cho', TO_DATE('2024-07-10', 'YYYY-MM-DD'));
INSERT INTO Users VALUES (6, 'user6', 'testtest', 'No', 'Posts', TO_DATE('2024-07-06', 'YYYY-MM-DD'), 0);

-- BelongsTo
INSERT INTO BelongsTo VALUES (1, 1);
INSERT INTO BelongsTo VALUES (2, 2);
INSERT INTO BelongsTo VALUES (3, 3);
INSERT INTO BelongsTo VALUES (4, 4);
INSERT INTO BelongsTo VALUES (5, 5);

-- Achievments
INSERT INTO Achievements VALUES (1, 'First Post!', 10);
INSERT INTO Achievements VALUES (2, 'Helpful Pet Owner', 50);
INSERT INTO Achievements VALUES (3, 'Pet Photo Pro', 100);
INSERT INTO Achievements VALUES (4, 'Community Contributor', 200);
INSERT INTO Achievements (achievement_id, achievement_name) VALUES (5, 'New Member');

-- Earns
INSERT INTO Earns VALUES (1, 1);
INSERT INTO Earns VALUES (2, 2);
INSERT INTO Earns VALUES (3, 3);
INSERT INTO Earns VALUES (4, 4);
INSERT INTO Earns VALUES (5, 5);

-- Notifications
INSERT INTO Notifications VALUES (1, TO_TIMESTAMP('2024-07-20 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'achievement', 1);
INSERT INTO Notifications VALUES (2, TO_TIMESTAMP('2024-07-20 09:15:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'message', 2);
INSERT INTO Notifications VALUES (3, TO_TIMESTAMP('2024-07-20 09:30:00', 'YYYY-MM-DD HH24:MI:SS'), 1, 'alert', 3);
INSERT INTO Notifications VALUES (4, TO_TIMESTAMP('2024-07-20 09:45:00', 'YYYY-MM-DD HH24:MI:SS'), 0, 'reminder', 4);
INSERT INTO Notifications (notification_id, sent_at, type, user_id) VALUES (5, TO_TIMESTAMP('2024-07-20 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'achievement', 5);

-- NotificationsContent
INSERT INTO NotificationsContent VALUES (TO_TIMESTAMP('2024-07-20 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'achievement', 'You earned your first badge!', 1);
INSERT INTO NotificationsContent VALUES (TO_TIMESTAMP('2024-07-20 09:15:00', 'YYYY-MM-DD HH24:MI:SS'), 'message', 'Welcome to the PawPals community!', 2);
INSERT INTO NotificationsContent VALUES (TO_TIMESTAMP('2024-07-20 09:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'alert', 'Your post received 5 likes.', 3);
INSERT INTO NotificationsContent VALUES (TO_TIMESTAMP('2024-07-20 09:45:00', 'YYYY-MM-DD HH24:MI:SS'), 'reminder', 'Time to feed your aquarium fish!', 4);
INSERT INTO NotificationsContent VALUES (TO_TIMESTAMP('2024-07-20 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'achievement', 'Reached Helpful Pet Owner level!', 5);

-- Pets
INSERT INTO Pets VALUES (1, 'Buddy', TO_DATE('2018-03-15', 'YYYY-MM-DD'), 'Dog');
INSERT INTO Pets VALUES (2, 'Whiskers', TO_DATE('2020-07-22', 'YYYY-MM-DD'), 'Cat');
INSERT INTO Pets VALUES (3, 'Nibbles', TO_DATE('2021-01-10', 'YYYY-MM-DD'), 'Hamster');
INSERT INTO Pets VALUES (4, 'Goldie', TO_DATE('2019-11-05', 'YYYY-MM-DD'), 'Fish');
INSERT INTO Pets VALUES (5, 'Tweety', TO_DATE('2022-05-30', 'YYYY-MM-DD'), 'Bird');
INSERT INTO Pets VALUES (6, 'Rocket', TO_DATE('2021-04-05', 'YYYY-MM-DD'), 'Dog');
INSERT INTO Pets VALUES (7, 'Cookie', TO_DATE('2024-11-17', 'YYYY-MM-DD'), 'Dog');

-- HasOwner
INSERT INTO HasOwner VALUES (1, 1);
INSERT INTO HasOwner VALUES (2, 2);
INSERT INTO HasOwner VALUES (3, 3);
INSERT INTO HasOwner VALUES (4, 4);
INSERT INTO HasOwner VALUES (5, 5);
INSERT INTO HasOwner VALUES (1, 2);
INSERT INTO HasOwner VALUES (1, 3);
INSERT INTO HasOwner VALUES (1, 6);
INSERT INTO HasOwner VALUES (1, 7);

-- Posts
INSERT INTO Posts VALUES (1, 'My First Dog Walk', TO_TIMESTAMP('2025-07-01 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), 10, '/dog.jpg', 1);
INSERT INTO Posts VALUES (2, 'Cat Nutrition Tips', TO_TIMESTAMP('2025-07-02 09:30:00', 'YYYY-MM-DD HH24:MI:SS'), 5, '/cat.jpg', 2);
INSERT INTO Posts VALUES (3, 'Setting up a Hamster Cage', TO_TIMESTAMP('2025-07-03 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 8, '/hamster.jpg', 3);
INSERT INTO Posts VALUES (4, 'Best Aquarium Plants', TO_TIMESTAMP('2025-07-04 14:45:00', 'YYYY-MM-DD HH24:MI:SS'), 12, '/fish.jpg', 4);
INSERT INTO Posts (post_id, title, created_at, thumbnail, user_id) VALUES (5, 'Bird Training Basics', TO_TIMESTAMP('2025-07-05 16:20:00', 'YYYY-MM-DD HH24:MI:SS'), '/bird.jpg', 5);
INSERT INTO Posts VALUES (6, 'My Second Dog Walk', TO_TIMESTAMP('2025-07-02 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), 11, '/dog.jpg', 1);
INSERT INTO Posts VALUES (7, 'My Third Dog Walk', TO_TIMESTAMP('2025-07-03 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), 12, '/dog.jpg', 1);
INSERT INTO Posts VALUES (8, 'My Fourth Dog Walk', TO_TIMESTAMP('2025-07-04 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), 13, '/dog.jpg', 1);
INSERT INTO Posts VALUES (9, 'My Fifth Dog Walk', TO_TIMESTAMP('2025-07-05 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), 14, '/dog.jpg', 1);
INSERT INTO Posts VALUES (10, 'My Sixth Dog Walk', TO_TIMESTAMP('2025-07-06 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), 15, '/dog.jpg', 1);
INSERT INTO Posts VALUES (11, 'My Seventh Dog Walk', TO_TIMESTAMP('2025-07-07 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), 16, '/dog.jpg', 1);
INSERT INTO Posts VALUES (12, 'Cat Nutrition Tips pt. 2', TO_TIMESTAMP('2025-07-03 09:30:00', 'YYYY-MM-DD HH24:MI:SS'), 13, '/cat.jpg', 2);
INSERT INTO Posts VALUES (13, 'Cat Nutrition Tips pt. 3', TO_TIMESTAMP('2025-07-04 09:30:00', 'YYYY-MM-DD HH24:MI:SS'), 20, '/cat.jpg', 2);
INSERT INTO Posts VALUES (14, 'Worst Aquarium Plants', TO_TIMESTAMP('2025-07-06 14:45:00', 'YYYY-MM-DD HH24:MI:SS'), 1, '/fish.jpg', 3);

-- PostsContent
INSERT INTO PostsContent VALUES ('My First Dog Walk', 'Today I took my dog for a 30-minute walk in the park.', TO_TIMESTAMP('2025-07-01 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), 1);
INSERT INTO PostsContent VALUES ('Cat Nutrition Tips', 'Feeding your cat a balanced diet is crucial for their health.', TO_TIMESTAMP('2025-07-02 09:30:00', 'YYYY-MM-DD HH24:MI:SS'), 2);
INSERT INTO PostsContent VALUES ('Setting up a Hamster Cage', 'Ensure the cage is spacious and clean for your hamster.', TO_TIMESTAMP('2025-07-03 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 3);
INSERT INTO PostsContent VALUES ('Best Aquarium Plants', 'Some plants help keep your aquarium clean and oxygenated.', TO_TIMESTAMP('2025-07-04 14:45:00', 'YYYY-MM-DD HH24:MI:SS'), 4);
INSERT INTO PostsContent VALUES ('Bird Training Basics', 'Start training your bird with simple commands and treats.', TO_TIMESTAMP('2025-07-05 16:20:00', 'YYYY-MM-DD HH24:MI:SS'), 5);
INSERT INTO PostsContent VALUES ('My Second Dog Walk', 'Another walk', TO_TIMESTAMP('2025-07-02 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), 1);
INSERT INTO PostsContent VALUES ('My Third Dog Walk', 'Another walk', TO_TIMESTAMP('2025-07-03 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), 1);
INSERT INTO PostsContent VALUES ('My Fourth Dog Walk', 'Another walk', TO_TIMESTAMP('2025-07-04 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), 1);
INSERT INTO PostsContent VALUES ('My Fifth Dog Walk', 'Another walk', TO_TIMESTAMP('2025-07-05 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), 1);
INSERT INTO PostsContent VALUES ('My Sixth Dog Walk', 'Another walk', TO_TIMESTAMP('2025-07-06 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), 1);
INSERT INTO PostsContent VALUES ('My Seventh Dog Walk', 'Another walk', TO_TIMESTAMP('2025-07-07 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), 1);
INSERT INTO PostsContent VALUES ('Cat Nutrition Tips pt. 2', 'More food', TO_TIMESTAMP('2025-07-03 09:30:00', 'YYYY-MM-DD HH24:MI:SS'), 2);
INSERT INTO PostsContent VALUES ('Cat Nutrition Tips pt. 3', 'More food', TO_TIMESTAMP('2025-07-04 09:30:00', 'YYYY-MM-DD HH24:MI:SS'), 2);
INSERT INTO PostsContent VALUES ('Worst Aquarium Plants', 'These are bad', TO_TIMESTAMP('2025-07-06 14:45:00', 'YYYY-MM-DD HH24:MI:SS'), 3);

-- AdvicePosts
INSERT INTO AdvicePosts VALUES (1, 'Dog Training');
INSERT INTO AdvicePosts VALUES (2, 'Cat Health');
INSERT INTO AdvicePosts VALUES (3, 'Small Pet Care');
INSERT INTO AdvicePosts VALUES (4, 'Aquarium Maintenance');
INSERT INTO AdvicePosts VALUES (5, 'Bird Behavior');

-- PetPosts
INSERT INTO PetPosts VALUES (1);
INSERT INTO PetPosts VALUES (2);
INSERT INTO PetPosts VALUES (3);
INSERT INTO PetPosts VALUES (4);
INSERT INTO PetPosts VALUES (5);
INSERT INTO PetPosts VALUES (6);
INSERT INTO PetPosts VALUES (7);
INSERT INTO PetPosts VALUES (8);
INSERT INTO PetPosts VALUES (9);
INSERT INTO PetPosts VALUES (10);
INSERT INTO PetPosts VALUES (11);

-- PetPostsIncludes
INSERT INTO PetPostsIncludes VALUES (1, 1);
INSERT INTO PetPostsIncludes VALUES (2, 2);
INSERT INTO PetPostsIncludes VALUES (3, 3);
INSERT INTO PetPostsIncludes VALUES (4, 4);
INSERT INTO PetPostsIncludes VALUES (5, 5);
INSERT INTO PetPostsIncludes VALUES (6, 6);
INSERT INTO PetPostsIncludes VALUES (7, 7);
INSERT INTO PetPostsIncludes VALUES (8, 1);
INSERT INTO PetPostsIncludes VALUES (9, 1);
INSERT INTO PetPostsIncludes VALUES (10, 1);
INSERT INTO PetPostsIncludes VALUES (11, 6);

-- PostDetails
INSERT INTO PostDetails VALUES (1, 1, 1);
INSERT INTO PostDetails VALUES (2, 2, 1);
INSERT INTO PostDetails VALUES (3, 1, 2);
INSERT INTO PostDetails VALUES (4, 1, 3);
INSERT INTO PostDetails VALUES (5, 1, 4);

-- PostDetailsOrder
INSERT INTO PostDetailsOrder VALUES (1, 'https://example.com/images/dog1.jpg', 1);
INSERT INTO PostDetailsOrder VALUES (2, 'https://example.com/images/dog2.jpg', 1);
INSERT INTO PostDetailsOrder VALUES (1, 'https://example.com/images/cat1.jpg', 2);
INSERT INTO PostDetailsOrder VALUES (1, 'https://example.com/images/hamster1.jpg', 3);
INSERT INTO PostDetailsOrder VALUES (1, 'https://example.com/images/fish1.jpg', 4);

-- Tags
INSERT INTO Tags VALUES (1, '#dogs');
INSERT INTO Tags VALUES (2, '#cats');
INSERT INTO Tags VALUES (3, '#aquarium');
INSERT INTO Tags VALUES (4, '#birds');
INSERT INTO Tags VALUES (5, '#hamsters');

-- TaggedWith
INSERT INTO TaggedWith VALUES (1, 1);
INSERT INTO TaggedWith VALUES (2, 2);
INSERT INTO TaggedWith VALUES (5, 3);
INSERT INTO TaggedWith VALUES (3, 4);
INSERT INTO TaggedWith VALUES (4, 5);
INSERT INTO TaggedWith VALUES (1, 6);
INSERT INTO TaggedWith VALUES (1, 7);
INSERT INTO TaggedWith VALUES (1, 8);
INSERT INTO TaggedWith VALUES (1, 9);
INSERT INTO TaggedWith VALUES (1, 10);
INSERT INTO TaggedWith VALUES (1, 11);
INSERT INTO TaggedWith VALUES (2, 12);
INSERT INTO TaggedWith VALUES (2, 13);

-- Comments
INSERT INTO Comments VALUES (1, TO_TIMESTAMP('2025-07-01 10:15:00', 'YYYY-MM-DD HH24:MI:SS'), 1, 1);
INSERT INTO Comments VALUES (2, TO_TIMESTAMP('2025-07-01 10:30:00', 'YYYY-MM-DD HH24:MI:SS'), 2, 2);
INSERT INTO Comments VALUES (3, TO_TIMESTAMP('2025-07-01 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 3, 1);
INSERT INTO Comments VALUES (4, TO_TIMESTAMP('2025-07-01 11:15:00', 'YYYY-MM-DD HH24:MI:SS'), 4, 3);
INSERT INTO Comments VALUES (5, TO_TIMESTAMP('2025-07-01 11:45:00', 'YYYY-MM-DD HH24:MI:SS'), 5, 4);
INSERT INTO Comments VALUES (6, TO_TIMESTAMP('2025-07-08 11:15:00', 'YYYY-MM-DD HH24:MI:SS'), 4, 14);

-- CommentsContent
INSERT INTO CommentsContent VALUES ('Such a cute dog!', TO_TIMESTAMP('2025-07-01 10:15:00', 'YYYY-MM-DD HH24:MI:SS'), 1, 1);
INSERT INTO CommentsContent VALUES ('Where did you adopt her?', TO_TIMESTAMP('2025-07-01 10:30:00', 'YYYY-MM-DD HH24:MI:SS'), 2, 2);
INSERT INTO CommentsContent VALUES ('Looks like my puppy', TO_TIMESTAMP('2025-07-01 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 3, 1);
INSERT INTO CommentsContent VALUES ('So fluffy!!', TO_TIMESTAMP('2025-07-01 11:15:00', 'YYYY-MM-DD HH24:MI:SS'), 4, 3);
INSERT INTO CommentsContent VALUES ('That’s adorable.', TO_TIMESTAMP('2025-07-01 11:45:00', 'YYYY-MM-DD HH24:MI:SS'), 5, 4);
INSERT INTO CommentsContent VALUES ('I agree', TO_TIMESTAMP('2025-07-08 11:15:00', 'YYYY-MM-DD HH24:MI:SS'), 4, 14);