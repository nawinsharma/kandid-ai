import { pgTable, text, timestamp, uuid, integer, boolean, jsonb, varchar, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (handled by Better Auth, but we'll define it for reference)
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  emailVerified: timestamp("email_verified"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Campaigns table
export const campaigns = pgTable("campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).notNull().default("draft"), // draft, active, paused, completed
  totalLeads: integer("total_leads").default(0).notNull(),
  successfulLeads: integer("successful_leads").default(0).notNull(),
  responseRate: decimal("response_rate", { precision: 5, scale: 2 }).default("0.00").notNull(),
  requestMessage: text("request_message"),
  connectionMessage: text("connection_message"),
  followupMessages: jsonb("followup_messages").$type<string[]>().default([]),
  settings: jsonb("settings").$type<{
    autopilot: boolean;
    personalization: boolean;
    selectedAccounts: string[];
  }>().default({ autopilot: false, personalization: true, selectedAccounts: [] }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Leads table
export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  title: text("title"),
  company: varchar("company", { length: 255 }),
  linkedinUrl: text("linkedin_url"),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, contacted, responded, converted, blocked
  activity: integer("activity").default(0).notNull(), // 1-5 scale
  lastContactDate: timestamp("last_contact_date"),
  interactionHistory: jsonb("interaction_history").$type<{
    type: string;
    message: string;
    timestamp: string;
    status: string;
  }[]>().default([]),
  campaignId: uuid("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// LinkedIn Accounts table
export const linkedinAccounts = pgTable("linkedin_accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("connected"), // connected, disconnected, error
  requestsSent: integer("requests_sent").default(0).notNull(),
  requestsLimit: integer("requests_limit").default(30).notNull(),
  progress: decimal("progress", { precision: 5, scale: 2 }).default("0.00").notNull(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertCampaignSchema = createInsertSchema(campaigns);
export const selectCampaignSchema = createSelectSchema(campaigns);

export const insertLeadSchema = createInsertSchema(leads);
export const selectLeadSchema = createSelectSchema(leads);

export const insertLinkedinAccountSchema = createInsertSchema(linkedinAccounts);
export const selectLinkedinAccountSchema = createSelectSchema(linkedinAccounts);

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

export type LinkedinAccount = typeof linkedinAccounts.$inferSelect;
export type NewLinkedinAccount = typeof linkedinAccounts.$inferInsert;
