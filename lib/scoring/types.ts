export type ScoringSource =
  | "auto_keyed"
  | "auto_indicator"
  | "auto_completion"
  | "teacher_light"
  | "supporting"
  | "not_scored";

export type EvidenceStrength =
  | "strong"
  | "moderate"
  | "limited"
  | "context_only"
  | "mixed"
  | "supporting";

export type ReviewStatus = "not_needed" | "needs_review" | "reviewed";

export type TeacherRating = {
  id?: string;
  productKey: string;
  worldId: string;
  competenceIds: string[];
  score: number;
  comment?: string;
  createdAt?: string;
};

export type EvidenceBundle = {
  stepResponses: Record<string, any>;
  eventsByName: Record<string, any[]>;
  submissionsByWorld: Record<string, { content: string; selfCheckJson: any | null; submissionType?: string }>;
  chatTurns: Array<{ worldId: string; turnNo: number; role: string; content: string }>;
  teacherRatings: TeacherRating[];
};

export type ScoreItem = {
  worldId: string;
  competenceId: string;
  domainId: string;
  score: number;
  evidenceJson: Record<string, any>;
  rubricVersion: string;
};
