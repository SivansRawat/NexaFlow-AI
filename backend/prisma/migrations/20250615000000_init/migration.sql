-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('Free', 'Paid');

-- CreateEnum
CREATE TYPE "ToolType" AS ENUM ('formula_master', 'sheet_summarizer', 'ai_workmate');

-- CreateEnum
CREATE TYPE "Sender" AS ENUM ('user', 'bot');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(32) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255),
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "subscriptionStart" TIMESTAMP(3),
    "expiry" TIMESTAMP(3),
    "plan" "Plan" NOT NULL DEFAULT 'Free',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "messageLimit" INTEGER NOT NULL DEFAULT 50,
    "emailLimit" INTEGER NOT NULL DEFAULT 50,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "googleId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(32) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "razorpay_order_id" VARCHAR(64) NOT NULL,
    "razorpay_payment_id" VARCHAR(64),
    "amount" INTEGER NOT NULL,
    "plan" VARCHAR(64) NOT NULL DEFAULT 'premium',
    "status" VARCHAR(32) NOT NULL,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "razorpay_orders" (
    "id" SERIAL NOT NULL,
    "razorpay_order_id" VARCHAR(64) NOT NULL,
    "amount" INTEGER NOT NULL,
    "planId" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "razorpay_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "excel_analysis_results" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "file_name" VARCHAR(255),
    "file_size" INTEGER,
    "file_type" VARCHAR(64),
    "errors" JSONB,
    "trends" JSONB,
    "insight" TEXT,
    "chat_history" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "excel_analysis_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aiworkmate_prompts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "prompt" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aiworkmate_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tool_type" "ToolType" NOT NULL,
    "title" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" SERIAL NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "sender" "Sender" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pdfchat" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "file_name" VARCHAR(255),
    "file_size" INTEGER,
    "file_type" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pdfchat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pdfchat_messages" (
    "id" SERIAL NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "sender" "Sender" NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pdfchat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mailchat" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mailchat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mailchat_messages" (
    "id" SERIAL NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "sender" "Sender" NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mailchat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjectlinechat" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjectlinechat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjectlinechat_messages" (
    "id" SERIAL NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "sender" "Sender" NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subjectlinechat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tonepolisherchat" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tonepolisherchat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tonepolisherchat_messages" (
    "id" SERIAL NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "sender" "Sender" NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tonepolisherchat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offer_letters" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" VARCHAR(255),
    "data" JSONB NOT NULL,
    "logo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offer_letters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "smart_invoices" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "businessName" VARCHAR(255) NOT NULL,
    "businessLogo" TEXT,
    "clientName" VARCHAR(255) NOT NULL,
    "clientEmail" VARCHAR(255),
    "businessAddress" VARCHAR(255),
    "clientAddress" VARCHAR(255),
    "clientPhoneNumber" VARCHAR(255),
    "businessEmail" VARCHAR(255),
    "businessPhoneNumber" VARCHAR(255),
    "subtotal" DOUBLE PRECISION NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL,
    "grandTotal" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "smart_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" SERIAL NOT NULL,
    "invoice_id" INTEGER NOT NULL,
    "itemName" VARCHAR(255) NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "taxPercentage" DOUBLE PRECISION NOT NULL,
    "finalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "socialmedia_caption_chat" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "platform" VARCHAR(50) NOT NULL,
    "industry" VARCHAR(100),
    "tone" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "socialmedia_caption_chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "socialmedia_caption_chat_messages" (
    "id" SERIAL NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "sender" "Sender" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "socialmedia_caption_chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hashtag_strategist_chat" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "platform" VARCHAR(50) NOT NULL,
    "industry" VARCHAR(100),
    "content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hashtag_strategist_chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hashtag_strategist_chat_messages" (
    "id" SERIAL NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "sender" "Sender" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hashtag_strategist_chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad_caption_chat" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "platform" VARCHAR(50) NOT NULL,
    "objective" VARCHAR(100),
    "product" VARCHAR(255),
    "tone" VARCHAR(50),
    "audience" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ad_caption_chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad_caption_chat_messages" (
    "id" SERIAL NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "sender" "Sender" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ad_caption_chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caption_rewriter_chat" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "caption_rewriter_chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caption_rewriter_chat_messages" (
    "id" SERIAL NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "sender" "Sender" NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "caption_rewriter_chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "smartdataextractor_session" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "file_name" VARCHAR(255),
    "file_size" INTEGER,
    "file_type" VARCHAR(64),
    "pdfText" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "smartdataextractor_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "smartdataextractor_message" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "sender" "Sender" NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "smartdataextractor_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mailmergeaichat" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mailmergeaichat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mailmergeaichat_messages" (
    "id" SERIAL NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "sender" "Sender" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mailmergeaichat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mail_templates" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(255),
    "description" VARCHAR(1024),
    "body" TEXT NOT NULL,
    "category" VARCHAR(100),
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mail_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_type" VARCHAR(64) NOT NULL,
    "file_path" VARCHAR(255),
    "file_size" INTEGER,
    "chroma_id" VARCHAR(255),
    "collection_id" VARCHAR(255),
    "status" VARCHAR(64) NOT NULL DEFAULT 'pending',
    "total_chunks" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chunks" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "chunk_number" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "chroma_id" VARCHAR(255),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chunks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");

-- CreateIndex
CREATE UNIQUE INDEX "payments_razorpay_order_id_key" ON "payments"("razorpay_order_id");

-- CreateIndex
CREATE INDEX "payments_user_id_idx" ON "payments"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "razorpay_orders_razorpay_order_id_key" ON "razorpay_orders"("razorpay_order_id");

-- CreateIndex
CREATE INDEX "excel_analysis_results_user_id_idx" ON "excel_analysis_results"("user_id");

-- CreateIndex
CREATE INDEX "aiworkmate_prompts_user_id_idx" ON "aiworkmate_prompts"("user_id");

-- CreateIndex
CREATE INDEX "chats_user_id_idx" ON "chats"("user_id");

-- CreateIndex
CREATE INDEX "chat_messages_chat_id_idx" ON "chat_messages"("chat_id");

-- CreateIndex
CREATE INDEX "pdfchat_user_id_idx" ON "pdfchat"("user_id");

-- CreateIndex
CREATE INDEX "pdfchat_messages_chat_id_idx" ON "pdfchat_messages"("chat_id");

-- CreateIndex
CREATE INDEX "mailchat_user_id_idx" ON "mailchat"("user_id");

-- CreateIndex
CREATE INDEX "mailchat_messages_chat_id_idx" ON "mailchat_messages"("chat_id");

-- CreateIndex
CREATE INDEX "subjectlinechat_user_id_idx" ON "subjectlinechat"("user_id");

-- CreateIndex
CREATE INDEX "subjectlinechat_messages_chat_id_idx" ON "subjectlinechat_messages"("chat_id");

-- CreateIndex
CREATE INDEX "tonepolisherchat_user_id_idx" ON "tonepolisherchat"("user_id");

-- CreateIndex
CREATE INDEX "tonepolisherchat_messages_chat_id_idx" ON "tonepolisherchat_messages"("chat_id");

-- CreateIndex
CREATE INDEX "offer_letters_user_id_idx" ON "offer_letters"("user_id");

-- CreateIndex
CREATE INDEX "smart_invoices_user_id_idx" ON "smart_invoices"("user_id");

-- CreateIndex
CREATE INDEX "invoice_items_invoice_id_idx" ON "invoice_items"("invoice_id");

-- CreateIndex
CREATE INDEX "socialmedia_caption_chat_user_id_idx" ON "socialmedia_caption_chat"("user_id");

-- CreateIndex
CREATE INDEX "socialmedia_caption_chat_messages_chat_id_idx" ON "socialmedia_caption_chat_messages"("chat_id");

-- CreateIndex
CREATE INDEX "hashtag_strategist_chat_user_id_idx" ON "hashtag_strategist_chat"("user_id");

-- CreateIndex
CREATE INDEX "hashtag_strategist_chat_messages_chat_id_idx" ON "hashtag_strategist_chat_messages"("chat_id");

-- CreateIndex
CREATE INDEX "ad_caption_chat_user_id_idx" ON "ad_caption_chat"("user_id");

-- CreateIndex
CREATE INDEX "ad_caption_chat_messages_chat_id_idx" ON "ad_caption_chat_messages"("chat_id");

-- CreateIndex
CREATE INDEX "caption_rewriter_chat_user_id_idx" ON "caption_rewriter_chat"("user_id");

-- CreateIndex
CREATE INDEX "caption_rewriter_chat_messages_chat_id_idx" ON "caption_rewriter_chat_messages"("chat_id");

-- CreateIndex
CREATE INDEX "smartdataextractor_session_user_id_idx" ON "smartdataextractor_session"("user_id");

-- CreateIndex
CREATE INDEX "smartdataextractor_message_session_id_idx" ON "smartdataextractor_message"("session_id");

-- CreateIndex
CREATE INDEX "mailmergeaichat_user_id_idx" ON "mailmergeaichat"("user_id");

-- CreateIndex
CREATE INDEX "mailmergeaichat_messages_chat_id_idx" ON "mailmergeaichat_messages"("chat_id");

-- CreateIndex
CREATE INDEX "mail_templates_user_id_idx" ON "mail_templates"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "mail_templates_userId_title_key" ON "mail_templates"("user_id", "title");

-- CreateIndex
CREATE INDEX "documents_user_id_idx" ON "documents"("user_id");

-- CreateIndex
CREATE INDEX "documents_chroma_id_idx" ON "documents"("chroma_id");

-- CreateIndex
CREATE INDEX "chunks_document_id_idx" ON "chunks"("document_id");

-- CreateIndex
CREATE INDEX "chunks_chroma_id_idx" ON "chunks"("chroma_id");

-- CreateIndex
CREATE UNIQUE INDEX "chunks_documentId_chunkNumber_key" ON "chunks"("document_id", "chunk_number");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "excel_analysis_results" ADD CONSTRAINT "excel_analysis_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aiworkmate_prompts" ADD CONSTRAINT "aiworkmate_prompts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pdfchat" ADD CONSTRAINT "pdfchat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pdfchat_messages" ADD CONSTRAINT "pdfchat_messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "pdfchat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mailchat" ADD CONSTRAINT "mailchat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mailchat_messages" ADD CONSTRAINT "mailchat_messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "mailchat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjectlinechat" ADD CONSTRAINT "subjectlinechat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjectlinechat_messages" ADD CONSTRAINT "subjectlinechat_messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "subjectlinechat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tonepolisherchat" ADD CONSTRAINT "tonepolisherchat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tonepolisherchat_messages" ADD CONSTRAINT "tonepolisherchat_messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "tonepolisherchat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_letters" ADD CONSTRAINT "offer_letters_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "smart_invoices" ADD CONSTRAINT "smart_invoices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "smart_invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "socialmedia_caption_chat" ADD CONSTRAINT "socialmedia_caption_chat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "socialmedia_caption_chat_messages" ADD CONSTRAINT "socialmedia_caption_chat_messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "socialmedia_caption_chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hashtag_strategist_chat" ADD CONSTRAINT "hashtag_strategist_chat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hashtag_strategist_chat_messages" ADD CONSTRAINT "hashtag_strategist_chat_messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "hashtag_strategist_chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad_caption_chat" ADD CONSTRAINT "ad_caption_chat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad_caption_chat_messages" ADD CONSTRAINT "ad_caption_chat_messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "ad_caption_chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caption_rewriter_chat" ADD CONSTRAINT "caption_rewriter_chat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caption_rewriter_chat_messages" ADD CONSTRAINT "caption_rewriter_chat_messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "caption_rewriter_chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "smartdataextractor_session" ADD CONSTRAINT "smartdataextractor_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "smartdataextractor_message" ADD CONSTRAINT "smartdataextractor_message_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "smartdataextractor_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mailmergeaichat" ADD CONSTRAINT "mailmergeaichat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mailmergeaichat_messages" ADD CONSTRAINT "mailmergeaichat_messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "mailmergeaichat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mail_templates" ADD CONSTRAINT "mail_templates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chunks" ADD CONSTRAINT "chunks_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

