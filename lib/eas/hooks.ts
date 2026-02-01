import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWalletClient } from "wagmi";
import { SafetyIncident, AttestationData, MitigationStatus } from "@/lib/types";
import {
  createIncidentAttestation,
  verifyIncident,
  updateMitigationStatus,
} from "@/lib/eas/attest";
import {
  getAllIncidents,
  getIncidentByUID,
  getUnverifiedIncidents,
} from "@/lib/eas/query";

export function useCreateAttestation() {
  const { data: walletClient } = useWalletClient();
  const queryClient = useQueryClient();
  const [txHash, setTxHash] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (incidentData: SafetyIncident) => {
      if (!walletClient) {
        throw new Error("Wallet not connected");
      }
      const uid = await createIncidentAttestation(incidentData, walletClient);
      return uid;
    },
    onSuccess: (uid) => {
      setTxHash(uid);
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });

  return {
    ...mutation,
    txHash,
  };
}

export function useIncidents() {
  return useQuery<AttestationData[], Error>({
    queryKey: ["incidents"],
    queryFn: getAllIncidents,
    staleTime: 30000,
  });
}

export function useIncident(uid: string | undefined) {
  return useQuery<AttestationData | null, Error>({
    queryKey: ["incident", uid],
    queryFn: () => (uid ? getIncidentByUID(uid) : Promise.resolve(null)),
    enabled: !!uid,
  });
}

export function useUnverifiedIncidents() {
  return useQuery<AttestationData[], Error>({
    queryKey: ["incidents", "unverified"],
    queryFn: getUnverifiedIncidents,
    staleTime: 30000,
  });
}

export function useVerifyIncident() {
  const { data: walletClient } = useWalletClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attestationUID: string) => {
      if (!walletClient) {
        throw new Error("Wallet not connected");
      }
      return await verifyIncident(attestationUID, walletClient);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });
}

export function useUpdateMitigation() {
  const { data: walletClient } = useWalletClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      attestationUID,
      status,
    }: {
      attestationUID: string;
      status: MitigationStatus;
    }) => {
      if (!walletClient) {
        throw new Error("Wallet not connected");
      }
      return await updateMitigationStatus(attestationUID, status, walletClient);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });
}
