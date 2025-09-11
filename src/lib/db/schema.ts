import { pgTable, text, varchar, integer, json, timestamp, decimal, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	email: varchar("email", { length: 255 }).notNull().unique(),
	name: text("name"),
	emailVerified: boolean("emailVerified").notNull(),
	image: text("image"),
	createdAt: timestamp("createdAt", { withTimezone: false }).notNull().defaultNow(),
	updatedAt: timestamp("updatedAt", { withTimezone: false }).notNull().defaultNow(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	expiresAt: timestamp("expiresAt", { withTimezone: false }).notNull(),
	token: text("token").notNull(),
	createdAt: timestamp("createdAt", { withTimezone: false }).notNull().defaultNow(),
	updatedAt: timestamp("updatedAt", { withTimezone: false }).notNull().defaultNow(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId").notNull(),
});

export const account = pgTable("account", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId").notNull(),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
	refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
	createdAt: timestamp("createdAt").defaultNow(),
	updatedAt: timestamp("updatedAt").defaultNow(),
});

export const campaigns = pgTable("campaigns", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	status: varchar("status", { length: 50 }).notNull().default("draft"),
	totalLeads: integer("total_leads").notNull().default(0),
	successfulLeads: integer("successful_leads").notNull().default(0),
	responseRate: decimal("response_rate", { precision: 5, scale: 2 }).notNull().default("0.00"),
	requestMessage: text("request_message"),
	connectionMessage: text("connection_message"),
	followupMessages: json("followup_messages").notNull().$type<string[]>(),
	settings: json("settings").notNull(),
	userId: text("user_id").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const leads = pgTable("leads", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }),
	title: text("title"),
	company: varchar("company", { length: 255 }),
	linkedinUrl: text("linkedin_url"),
	profileImage: text("profile_image"),
	status: varchar("status", { length: 50 }).notNull().default("pending"),
	activity: integer("activity").notNull().default(0),
	lastContactDate: timestamp("last_contact_date"),
	interactionHistory: json("interaction_history").notNull().$type<unknown[]>(),
	campaignId: text("campaign_id").notNull(),
	userId: text("user_id").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const linkedinAccounts = pgTable("linkedin_accounts", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	status: varchar("status", { length: 50 }).notNull().default("connected"),
	requestsSent: integer("requests_sent").notNull().default(0),
	requestsLimit: integer("requests_limit").notNull().default(30),
	progress: decimal("progress", { precision: 5, scale: 2 }).notNull().default("0.00"),
	userId: text("user_id").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


