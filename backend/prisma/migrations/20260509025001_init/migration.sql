/*
  Warnings:

  - Added the required column `preco` to the `Livro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantidade` to the `Livro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `livro` ADD COLUMN `preco` DOUBLE NOT NULL,
    ADD COLUMN `quantidade` INTEGER NOT NULL;
