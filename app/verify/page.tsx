"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useUnverifiedIncidents, useVerifyIncident } from "@/lib/eas/hooks";
import { IncidentCard } from "@/components/ui/IncidentCard";

export const dynamic = "force-dynamic";

export default function VerifyPage() {
  const { isConnected } = useAccount();
  const { data: unverifiedIncidents, isLoading } = useUnverifiedIncidents();
  const { mutate: verify, isPending } = useVerifyIncident();

  function handleVerify(uid: string) {
    if (confirm("Are you sure you want to verify this incident?")) {
      verify(uid);
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Verification Dashboard
        </h1>
        <p className="text-gray-600 mb-8">
          Connect your wallet to verify AI safety incidents.
        </p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Verification Dashboard
        </h1>
        <p className="text-gray-600">
          Review and verify unverified incidents. Your verification will be
          recorded on-chain as an attestation.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-blue-900 mb-2">
          Verification Guidelines
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Review the incident details and evidence carefully</li>
          <li>• Verify that the information is accurate and factual</li>
          <li>• Check that evidence supports the claims made</li>
          <li>
            • Only verify incidents you have knowledge or expertise to assess
          </li>
          <li>• Your verification creates an on-chain attestation</li>
        </ul>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-600">
          Loading unverified incidents...
        </div>
      ) : !unverifiedIncidents || unverifiedIncidents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-2">
            No unverified incidents at this time.
          </p>
          <p className="text-sm text-gray-500">
            All incidents have been verified. Check back later!
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-4 text-sm text-gray-600">
            {unverifiedIncidents.length} incident(s) awaiting verification
          </div>
          <div className="grid grid-cols-1 gap-4">
            {unverifiedIncidents.map((incident) => (
              <div key={incident.uid} className="relative">
                <IncidentCard incident={incident} />
                <div className="absolute top-4 right-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleVerify(incident.uid);
                    }}
                    disabled={isPending}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? "Verifying..." : "Verify"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-semibold text-yellow-900 mb-2">Note</h3>
        <p className="text-sm text-yellow-800">
          Verifying an incident requires signing a transaction on the Sepolia
          testnet. Make sure you have some Sepolia ETH in your wallet for gas
          fees.
        </p>
      </div>
    </div>
  );
}
