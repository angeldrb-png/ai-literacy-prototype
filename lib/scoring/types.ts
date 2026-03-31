export type EvidenceBundle = {
  stepResponses: Record<string, any>;
  eventsByName: Record<string, any[]>;
  submissionsByWorld: Record<string, { content: string; selfCheckJson: any | null }>;
  chatTurns: Array<{ worldId: string; turnNo: number; role: string; content: string }>;
};

export type ScoreItem = {
  worldId: string;
  competenceId: string;
  domainId: string;
  score: number;
  evidenceJson: Record<string, any>;
  rubricVersion: string;
};
