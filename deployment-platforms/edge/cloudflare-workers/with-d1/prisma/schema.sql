-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE TOKEN (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	token TEXT NOT NULL,
	user_id INTEGER NOT NULL,
	FOREIGN KEY (user_id) REFERENCES User(id)
);

-- CreateIndex
CREATE UNIQUE INDEX "User_token_key" ON "TOKEN"("token", "user_id");
