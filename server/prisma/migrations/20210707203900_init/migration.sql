-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191),
    `passwordHash` VARCHAR(191),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3),
    `resetToken` VARCHAR(191),
    `resetTokenExpirationDate` DATETIME(3),

    UNIQUE INDEX `User.email_unique`(`email`),
    UNIQUE INDEX `User.resetToken_unique`(`resetToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
