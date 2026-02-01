import { EAS } from "@ethereum-attestation-service/eas-sdk";
import { WalletClient } from "viem";
import { EAS_CONTRACT_ADDRESS, SCHEMA_UID } from "@/lib/config/eas";
import { SafetyIncident, MitigationStatus } from "@/lib/types";
import { encodeIncidentData, decodeAttestationData } from "@/lib/eas/schema";

export async function createIncidentAttestation(
  incidentData: SafetyIncident,
  walletClient: WalletClient
): Promise<string> {
  const eas = new EAS(EAS_CONTRACT_ADDRESS);

  eas.connect(walletClient as any);

  const encodedData = encodeIncidentData(incidentData);

  const tx = await eas.attest({
    schema: SCHEMA_UID,
    data: {
      recipient: "0x0000000000000000000000000000000000000000",
      expirationTime: BigInt(0),
      revocable: true,
      data: encodedData,
    },
  });

  const uid = await tx.wait();
  return uid;
}

export async function verifyIncident(
  attestationUID: string,
  walletClient: WalletClient
): Promise<string> {
  const eas = new EAS(EAS_CONTRACT_ADDRESS);
  eas.connect(walletClient as any);

  const attestation = await eas.getAttestation(attestationUID);
  const incidentData = decodeAttestationData(attestation.data);

  const updatedIncident: SafetyIncident = {
    ...incidentData,
    verified: true,
  };

  const encodedData = encodeIncidentData(updatedIncident);

  const tx = await eas.attest({
    schema: SCHEMA_UID,
    data: {
      recipient: attestation.attester,
      expirationTime: BigInt(0),
      revocable: true,
      refUID: attestationUID,
      data: encodedData,
    },
  });

  const uid = await tx.wait();
  return uid;
}

export async function updateMitigationStatus(
  attestationUID: string,
  status: MitigationStatus,
  walletClient: WalletClient
): Promise<string> {
  const eas = new EAS(EAS_CONTRACT_ADDRESS);
  eas.connect(walletClient as any);

  const attestation = await eas.getAttestation(attestationUID);
  const incidentData = decodeAttestationData(attestation.data);

  const updatedIncident: SafetyIncident = {
    ...incidentData,
    mitigationStatus: status,
  };

  const encodedData = encodeIncidentData(updatedIncident);

  const tx = await eas.attest({
    schema: SCHEMA_UID,
    data: {
      recipient: attestation.attester,
      expirationTime: BigInt(0),
      revocable: true,
      refUID: attestationUID,
      data: encodedData,
    },
  });

  const uid = await tx.wait();
  return uid;
}
