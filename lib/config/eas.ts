export const EAS_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_EAS_CONTRACT ||
  "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";

export const SCHEMA_REGISTRY_ADDRESS =
  process.env.NEXT_PUBLIC_SCHEMA_REGISTRY ||
  "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";

export const SCHEMA_UID =
  process.env.NEXT_PUBLIC_SCHEMA_UID || "TO_BE_FILLED_AFTER_REGISTRATION";

export const SCHEMA_STRING =
  "string incidentType,string modelIdentifier,uint8 severityLevel,string description,string evidenceHash,uint64 timestamp,string reporterRole,bool verified,string mitigationStatus";

export const SEPOLIA_CHAIN_ID = 11155111;

export const EASSCAN_BASE_URL = "https://sepolia.easscan.org";
export const EASSCAN_ATTESTATION_URL = `${EASSCAN_BASE_URL}/attestation`;
export const EAS_GRAPHQL_URL = `${EASSCAN_BASE_URL}/graphql`;
