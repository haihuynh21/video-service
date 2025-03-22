-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "url" TEXT,
    "streamUrl" TEXT,
    "thumbnailUrl" TEXT,
    "hlsUrl" TEXT,
    "r2Url" TEXT,
    "r2ThumbnailUrl" TEXT,
    "r2HlsUrl" TEXT,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "width" INTEGER NOT NULL DEFAULT 0,
    "height" INTEGER NOT NULL DEFAULT 0,
    "bitrate" INTEGER NOT NULL DEFAULT 0,
    "format" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);
