-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subject" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "securityRole" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MemberBase" (
    "memberId" TEXT NOT NULL PRIMARY KEY,
    "iconUrl" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "firstNameKana" TEXT NOT NULL,
    "lastNameKana" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MemberBase_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MemberStatus" (
    "memberId" TEXT NOT NULL PRIMARY KEY,
    "hasDeleted" BOOLEAN NOT NULL DEFAULT false,
    "lastRenewalDate" DATETIME NOT NULL,
    "updatedHasDeletedAt" DATETIME NOT NULL,
    "updatedHasDeletedById" TEXT NOT NULL,
    "updatedLastRenewalDateById" TEXT NOT NULL,
    CONSTRAINT "MemberStatus_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MemberStatus_updatedHasDeletedById_fkey" FOREIGN KEY ("updatedHasDeletedById") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MemberStatus_updatedLastRenewalDateById_fkey" FOREIGN KEY ("updatedLastRenewalDateById") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MemberSensitive" (
    "memberId" TEXT NOT NULL PRIMARY KEY,
    "birthday" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "currentZipCode" TEXT NOT NULL,
    "currentAddress" TEXT NOT NULL,
    "parentsZipCode" TEXT NOT NULL,
    "parentsAddress" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MemberSensitive_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MemberActive" (
    "memberId" TEXT NOT NULL PRIMARY KEY,
    "grade" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MemberActive_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MemberActiveInternal" (
    "memberId" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MemberActiveInternal_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MemberActiveExternal" (
    "memberId" TEXT NOT NULL PRIMARY KEY,
    "schoolName" TEXT NOT NULL,
    "schoolMajor" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MemberActiveExternal_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MemberAlumni" (
    "memberId" TEXT NOT NULL PRIMARY KEY,
    "graduatedYear" INTEGER NOT NULL,
    "oldRole" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MemberAlumni_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "payerId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "hasApproved" BOOLEAN NOT NULL DEFAULT false,
    "approverId" TEXT,
    "receivedAt" DATETIME NOT NULL,
    "approvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payment_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payment_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "Member" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Snapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_id_key" ON "Member"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Member_subject_key" ON "Member"("subject");

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MemberBase_memberId_key" ON "MemberBase"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberStatus_memberId_key" ON "MemberStatus"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberSensitive_memberId_key" ON "MemberSensitive"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberActive_memberId_key" ON "MemberActive"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberActiveInternal_memberId_key" ON "MemberActiveInternal"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberActiveInternal_studentId_key" ON "MemberActiveInternal"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberActiveExternal_memberId_key" ON "MemberActiveExternal"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberAlumni_memberId_key" ON "MemberAlumni"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_id_key" ON "Payment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Snapshot_id_key" ON "Snapshot"("id");

-- Seed
INSERT INTO "Member" ("id", "subject", "email", "securityRole", "updatedAt") VALUES
('0188c0f2-8e47-11ec-b909-0242ac120002', 'Mathematics', 'math@example.com', 'OWNER', CURRENT_TIMESTAMP),
('0188c0f2-8e47-11ec-b909-0242ac120003', 'Science', 'science@example.com', 'USER', CURRENT_TIMESTAMP),
('0188c0f2-8e47-11ec-b909-0242ac120004', 'History', 'history@example.com', 'USER', CURRENT_TIMESTAMP);

-- Seed Data for MemberBase
INSERT INTO "MemberBase" ("memberId", "iconUrl", "firstName", "lastName", "firstNameKana", "lastNameKana", "updatedAt") VALUES
('0188c0f2-8e47-11ec-b909-0242ac120002', 'http://example.com/icon1.png', 'Taro', 'Yamada', 'タロウ', 'ヤマダ', CURRENT_TIMESTAMP),
('0188c0f2-8e47-11ec-b909-0242ac120003', 'http://example.com/icon2.png', 'Hanako', 'Tanaka', 'ハナコ', 'タナカ', CURRENT_TIMESTAMP),
('0188c0f2-8e47-11ec-b909-0242ac120004', 'http://example.com/icon3.png', 'Kenji', 'Suzuki', 'ケンジ', 'スズキ', CURRENT_TIMESTAMP);

-- Seed Data for MemberActive
INSERT INTO "MemberActive" ("memberId", "grade", "updatedAt") VALUES
('0188c0f2-8e47-11ec-b909-0242ac120002', 'B1', CURRENT_TIMESTAMP);

-- Seed Data for MemberActiveInternal
INSERT INTO "MemberActiveInternal" ("memberId", "studentId", "role", "updatedAt") VALUES
('0188c0f2-8e47-11ec-b909-0242ac120002', 'k23000', 'CHAIRPERSON', CURRENT_TIMESTAMP);

-- Seed Data for MemberActiveExternal
INSERT INTO "MemberActiveExternal" ("memberId", "schoolName", "schoolMajor", "organization", "updatedAt") VALUES
('0188c0f2-8e47-11ec-b909-0242ac120003', 'University of Science', 'Physics', 'Physics Society', CURRENT_TIMESTAMP),
('0188c0f2-8e47-11ec-b909-0242ac120004', 'University of Science', 'Physics', 'Physics Society', CURRENT_TIMESTAMP);

-- Seed Data for MemberSensitive
INSERT INTO "MemberSensitive" ("memberId", "birthday", "gender", "phoneNumber", "currentZipCode", "currentAddress", "parentsZipCode", "parentsAddress", "updatedAt") VALUES
('0188c0f2-8e47-11ec-b909-0242ac120002', '2001-01-01', 'male', '000-0000-0000', '111-1111', '鳥県ペンギン市アデリーペンギン町東区', '111-1112', '鳥県ペンギン市エンペラーペンギン町', CURRENT_TIMESTAMP),
('0188c0f2-8e47-11ec-b909-0242ac120003', '2002-02-02', 'female', '111-1111-1111', '222-2222', '鯨県マイルカ市シャチ町文字幅調整区', '222-2223', '鯨県マイルカ市カマイルカ町文字幅区', CURRENT_TIMESTAMP),
('0188c0f2-8e47-11ec-b909-0242ac120004', '2003-03-03', 'other', '222-2222-2222', '333-3333', '硬骨魚県肉鰭市シーラカンス町11丁目', '333-3334', '硬骨魚県肉鰭市他の魚知らない街西区', CURRENT_TIMESTAMP);

-- Seed Data for MemberStatus
INSERT INTO "MemberStatus" ("memberId", "hasDeleted", "lastRenewalDate", "updatedHasDeletedAt", "updatedHasDeletedById", "updatedLastRenewalDateById") VALUES
('0188c0f2-8e47-11ec-b909-0242ac120002', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '0188c0f2-8e47-11ec-b909-0242ac120002', '0188c0f2-8e47-11ec-b909-0242ac120002'),
('0188c0f2-8e47-11ec-b909-0242ac120003', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '0188c0f2-8e47-11ec-b909-0242ac120002', '0188c0f2-8e47-11ec-b909-0242ac120002'),
('0188c0f2-8e47-11ec-b909-0242ac120004', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '0188c0f2-8e47-11ec-b909-0242ac120002', '0188c0f2-8e47-11ec-b909-0242ac120002');
