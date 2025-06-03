import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Define the application schema
export const ApplicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  url: z.string().min(1, "URL is required"),
  icon: z.string().min(1, "Icon is required"),
  status_endpoint: z.string().optional(),
});

export const ConfigSchema = z.object({
  require_passcode: z.boolean().optional(),
  passcode: z.string().optional(),
  apps: z.array(ApplicationSchema),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Application = z.infer<typeof ApplicationSchema>;
export type Config = z.infer<typeof ConfigSchema>;
