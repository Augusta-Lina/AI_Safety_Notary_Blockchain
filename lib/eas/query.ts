import { EAS_GRAPHQL_URL, SCHEMA_UID } from "@/lib/config/eas";
import { AttestationData } from "@/lib/types";
import { decodeAttestationData } from "@/lib/eas/schema";

interface GraphQLAttestation {
  id: string;
  attester: string;
  recipient: string;
  revocable: boolean;
  revoked: boolean;
  expirationTime: string;
  data: string;
  txid: string;
  timeCreated: string;
}

interface GraphQLResponse {
  data: {
    attestations: GraphQLAttestation[];
  };
}

async function queryGraphQL(query: string): Promise<GraphQLAttestation[]> {
  const response = await fetch(EAS_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL query failed: ${response.statusText}`);
  }

  const result: GraphQLResponse = await response.json();
  return result.data.attestations;
}

function transformAttestation(
  attestation: GraphQLAttestation
): AttestationData {
  const incidentData = decodeAttestationData(attestation.data);

  return {
    ...incidentData,
    uid: attestation.id,
    attester: attestation.attester,
    recipient: attestation.recipient,
    revocable: attestation.revocable,
    revoked: attestation.revoked,
    expirationTime: BigInt(attestation.expirationTime),
    txHash: attestation.txid,
    createdAt: BigInt(attestation.timeCreated),
  };
}

export async function getAllIncidents(): Promise<AttestationData[]> {
  const query = `
    query GetAllIncidents {
      attestations(
        where: { schemaId: { equals: "${SCHEMA_UID}" } }
        orderBy: { timeCreated: desc }
      ) {
        id
        attester
        recipient
        revocable
        revoked
        expirationTime
        data
        txid
        timeCreated
      }
    }
  `;

  const attestations = await queryGraphQL(query);
  return attestations.map(transformAttestation);
}

export async function getIncidentByUID(
  uid: string
): Promise<AttestationData | null> {
  const query = `
    query GetIncidentByUID {
      attestations(where: { id: { equals: "${uid}" } }) {
        id
        attester
        recipient
        revocable
        revoked
        expirationTime
        data
        txid
        timeCreated
      }
    }
  `;

  const attestations = await queryGraphQL(query);
  if (attestations.length === 0) {
    return null;
  }

  return transformAttestation(attestations[0]);
}

export async function getUnverifiedIncidents(): Promise<AttestationData[]> {
  const allIncidents = await getAllIncidents();
  return allIncidents.filter((incident) => !incident.verified);
}

export async function getIncidentsBySeverity(
  severityLevel: number
): Promise<AttestationData[]> {
  const allIncidents = await getAllIncidents();
  return allIncidents.filter(
    (incident) => incident.severityLevel === severityLevel
  );
}
