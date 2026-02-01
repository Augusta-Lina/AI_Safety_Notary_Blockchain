export type IncidentType =
  | "bias"
  | "hallucination"
  | "safety-violation"
  | "data-leak"
  | "other";

export type SeverityLevel = 1 | 2 | 3 | 4 | 5;

export type ReporterRole =
  | "researcher"
  | "engineer"
  | "user"
  | "auditor"
  | "other";

export type MitigationStatus =
  | "pending"
  | "investigating"
  | "mitigated"
  | "wont-fix";

export interface SafetyIncident {
  incidentType: IncidentType;
  modelIdentifier: string;
  severityLevel: SeverityLevel;
  description: string;
  evidenceHash: string;
  timestamp: bigint;
  reporterRole: ReporterRole;
  verified: boolean;
  mitigationStatus: MitigationStatus;
}

export interface AttestationData extends SafetyIncident {
  uid: string;
  attester: string;
  recipient: string;
  revocable: boolean;
  revoked: boolean;
  expirationTime: bigint;
  txHash: string;
  createdAt: bigint;
}

export interface EvidenceMetadata {
  version: string;
  incidentType: IncidentType;
  detailedDescription: string;
  evidence: {
    screenshots?: string[];
    logs?: string;
    reproducibility?: string;
    additionalFiles?: string[];
  };
  submittedAt: string;
}

export interface IncidentFormData {
  incidentType: IncidentType;
  modelIdentifier: string;
  severityLevel: SeverityLevel;
  description: string;
  detailedDescription: string;
  reporterRole: ReporterRole;
  evidenceFiles: File[];
}
