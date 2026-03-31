import { z } from "zod";

const jsonObjectSchema = z.object({}).catchall(z.any());

export const sessionStartSchema = z.object({
  language: z.enum(["zh-Hans", "zh-Hant", "en"]),
  deviceType: z.string().optional(),
  regionNote: z.string().optional(),
  studentName: z.string().min(1),
  studentCode: z.string().min(1),
  className: z.string().min(1),
  schoolName: z.string().optional(),
  gradeLevel: z.string().optional(),
});

export const sessionEndSchema = z.object({
  sessionId: z.string().uuid(),
  currentWorld: z.string().optional(),
  currentStep: z.string().optional(),
  status: z.enum(["completed", "abandoned", "in_progress"]).optional(),
});

export const eventLogSchema = z.object({
  sessionId: z.string().uuid(),
  worldId: z.string(),
  stepId: z.string().optional(),
  eventType: z.enum(["navigation", "selection", "submit", "chat", "save"]),
  eventName: z.string(),
  eventValueJson: jsonObjectSchema.optional(),
});

export const stepResponseSchema = z.object({
  sessionId: z.string().uuid(),
  worldId: z.string(),
  stepId: z.string(),
  responseJson: jsonObjectSchema,
});

export const chatLogSchema = z.object({
  sessionId: z.string().uuid(),
  worldId: z.string().default("w3"),
  turnNo: z.number().int().positive(),
  role: z.enum(["user", "ai"]),
  content: z.string().min(1),
});

export const submissionSchema = z.object({
  sessionId: z.string().uuid(),
  worldId: z.string(),
  submissionType: z.enum(["info_card", "warm_card", "workflow_card", "model_card_lite"]),
  content: z.string().min(1),
  selfCheckJson: jsonObjectSchema.optional(),
});

export const scoreRunSchema = z.object({
  sessionId: z.string().uuid(),
});

export type SessionStartInput = z.infer<typeof sessionStartSchema>;
export type SessionEndInput = z.infer<typeof sessionEndSchema>;
export type EventLogInput = z.infer<typeof eventLogSchema>;
export type StepResponseInput = z.infer<typeof stepResponseSchema>;
export type ChatLogInput = z.infer<typeof chatLogSchema>;
export type SubmissionInput = z.infer<typeof submissionSchema>;
export type ScoreRunInput = z.infer<typeof scoreRunSchema>;
