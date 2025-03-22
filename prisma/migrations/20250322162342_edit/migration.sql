/*
  Warnings:

  - Made the column `url` on table `Video` required. This step will fail if there are existing NULL values in that column.
  - Made the column `streamUrl` on table `Video` required. This step will fail if there are existing NULL values in that column.
  - Made the column `thumbnailUrl` on table `Video` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hlsUrl` on table `Video` required. This step will fail if there are existing NULL values in that column.
  - Made the column `r2Url` on table `Video` required. This step will fail if there are existing NULL values in that column.
  - Made the column `r2ThumbnailUrl` on table `Video` required. This step will fail if there are existing NULL values in that column.
  - Made the column `r2HlsUrl` on table `Video` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "url" SET NOT NULL,
ALTER COLUMN "url" SET DEFAULT '',
ALTER COLUMN "streamUrl" SET NOT NULL,
ALTER COLUMN "streamUrl" SET DEFAULT '',
ALTER COLUMN "thumbnailUrl" SET NOT NULL,
ALTER COLUMN "thumbnailUrl" SET DEFAULT '',
ALTER COLUMN "hlsUrl" SET NOT NULL,
ALTER COLUMN "hlsUrl" SET DEFAULT '',
ALTER COLUMN "r2Url" SET NOT NULL,
ALTER COLUMN "r2Url" SET DEFAULT '',
ALTER COLUMN "r2ThumbnailUrl" SET NOT NULL,
ALTER COLUMN "r2ThumbnailUrl" SET DEFAULT '',
ALTER COLUMN "r2HlsUrl" SET NOT NULL,
ALTER COLUMN "r2HlsUrl" SET DEFAULT '';
