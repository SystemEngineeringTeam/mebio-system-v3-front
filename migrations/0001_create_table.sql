-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "securityRole" INTEGER NOT NULL,
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
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MemberBase_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MemberStatus" (
    "memberId" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "memberIdAsModifier" TEXT NOT NULL,
    CONSTRAINT "MemberStatus_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MemberStatus_memberIdAsModifier_fkey" FOREIGN KEY ("memberIdAsModifier") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
    "retentionBias" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MemberActive_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MemberInternal" (
    "memberId" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MemberInternal_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MemberExternal" (
    "memberId" TEXT NOT NULL PRIMARY KEY,
    "schoolName" TEXT NOT NULL,
    "schoolMajor" TEXT NOT NULL,
    "enrollYear" INTEGER NOT NULL,
    "organization" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MemberExternal_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
    "payeeId" TEXT NOT NULL,
    "receivedAt" DATETIME NOT NULL,
    "hasAccountantApproved" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payment_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payment_payeeId_fkey" FOREIGN KEY ("payeeId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_id_key" ON "Member"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MemberBase_memberId_key" ON "MemberBase"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberStatus_memberId_key" ON "MemberStatus"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberSensitive_memberId_key" ON "MemberSensitive"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberActive_memberId_key" ON "MemberActive"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberInternal_memberId_key" ON "MemberInternal"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberExternal_memberId_key" ON "MemberExternal"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberAlumni_memberId_key" ON "MemberAlumni"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_id_key" ON "Payment"("id");
