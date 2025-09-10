import { z } from "zod";

// Zod schemas for validation
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  image: z.string().optional(),
  emailVerified: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const campaignSchema = z.object({
  id: z.string(),
  name: z.string().max(255),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "paused", "completed"]).default("draft"),
  totalLeads: z.number().int().default(0),
  successfulLeads: z.number().int().default(0),
  responseRate: z.number().default(0.00),
  requestMessage: z.string().optional(),
  connectionMessage: z.string().optional(),
  followupMessages: z.array(z.string()).default([]),
  settings: z.object({
    autopilot: z.boolean().default(false),
    personalization: z.boolean().default(true),
    selectedAccounts: z.array(z.string()).default([]),
  }).default({ autopilot: false, personalization: true, selectedAccounts: [] }),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const leadSchema = z.object({
  id: z.string(),
  name: z.string().max(255),
  email: z.string().email().optional(),
  title: z.string().optional(),
  company: z.string().max(255).optional(),
  linkedinUrl: z.string().url().optional(),
  profileImage: z.string().url().optional(),
  status: z.enum(["pending", "contacted", "responded", "converted", "blocked"]).default("pending"),
  activity: z.number().int().min(0).max(5).default(0),
  lastContactDate: z.date().optional(),
  interactionHistory: z.array(z.object({
    type: z.string(),
    message: z.string(),
    timestamp: z.string(),
    status: z.string(),
  })).default([]),
  campaignId: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const linkedinAccountSchema = z.object({
  id: z.string(),
  name: z.string().max(255),
  email: z.string().email(),
  status: z.enum(["connected", "disconnected", "error"]).default("connected"),
  requestsSent: z.number().int().default(0),
  requestsLimit: z.number().int().default(30),
  progress: z.number().default(0.00),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Insert schemas (for creating new records)
export const insertUserSchema = userSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const insertCampaignSchema = campaignSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadSchema = leadSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLinkedinAccountSchema = linkedinAccountSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update schemas (for updating existing records)
export const updateUserSchema = insertUserSchema.partial();
export const updateCampaignSchema = insertCampaignSchema.partial();
export const updateLeadSchema = insertLeadSchema.partial();
export const updateLinkedinAccountSchema = insertLinkedinAccountSchema.partial();

// Type exports
export type User = z.infer<typeof userSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

export type Campaign = z.infer<typeof campaignSchema>;
export type NewCampaign = z.infer<typeof insertCampaignSchema>;
export type UpdateCampaign = z.infer<typeof updateCampaignSchema>;

export type Lead = z.infer<typeof leadSchema>;
export type NewLead = z.infer<typeof insertLeadSchema>;
export type UpdateLead = z.infer<typeof updateLeadSchema>;

export type LinkedinAccount = z.infer<typeof linkedinAccountSchema>;
export type NewLinkedinAccount = z.infer<typeof insertLinkedinAccountSchema>;
export type UpdateLinkedinAccount = z.infer<typeof updateLinkedinAccountSchema>;