import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { SCHEMA_STRING } from "@/lib/config/eas";
import { SafetyIncident } from "@/lib/types";

export function getSchemaEncoder(): SchemaEncoder {
  return new SchemaEncoder(SCHEMA_STRING);
}

export function encodeIncidentData(incident: SafetyIncident): string {
  const encoder = getSchemaEncoder();

  const encodedData = encoder.encodeData([
    { name: "incidentType", value: incident.incidentType, type: "string" },
    {
      name: "modelIdentifier",
      value: incident.modelIdentifier,
      type: "string",
    },
    {
      name: "severityLevel",
      value: incident.severityLevel,
      type: "uint8",
    },
    { name: "description", value: incident.description, type: "string" },
    { name: "evidenceHash", value: incident.evidenceHash, type: "string" },
    { name: "timestamp", value: incident.timestamp, type: "uint64" },
    { name: "reporterRole", value: incident.reporterRole, type: "string" },
    { name: "verified", value: incident.verified, type: "bool" },
    {
      name: "mitigationStatus",
      value: incident.mitigationStatus,
      type: "string",
    },
  ]);

  return encodedData;
}

export function decodeAttestationData(encodedData: string): SafetyIncident {
  const encoder = getSchemaEncoder();
  const decodedData = encoder.decodeData(encodedData);

  return {
    incidentType: decodedData[0].value.value as SafetyIncident["incidentType"],
    modelIdentifier: decodedData[1].value.value as string,
    severityLevel: Number(decodedData[2].value.value) as SafetyIncident["severityLevel"],
    description: decodedData[3].value.value as string,
    evidenceHash: decodedData[4].value.value as string,
    timestamp: BigInt(decodedData[5].value.value as string | number | bigint),
    reporterRole: decodedData[6].value.value as SafetyIncident["reporterRole"],
    verified: decodedData[7].value.value as boolean,
    mitigationStatus: decodedData[8].value.value as SafetyIncident["mitigationStatus"],
  };
}
