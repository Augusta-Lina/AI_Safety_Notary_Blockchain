"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IncidentForm } from "@/components/ui/IncidentForm";

export const dynamic = "force-dynamic";

export default function SubmitPage() {
  const { isConnected, chain } = useAccount();
  const isWrongNetwork = chain?.id !== 11155111;

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Submit Safety Incident
        </h1>
        <p className="text-gray-600 mb-8">
          Connect your wallet to submit an AI safety incident to the registry.
        </p>
        <ConnectButton />
      </div>
    );
  }

  if (isWrongNetwork) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Wrong Network
        </h1>
        <p className="text-gray-600 mb-8">
          Please switch to Sepolia testnet to submit incidents.
        </p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Submit Safety Incident
        </h1>
        <p className="text-gray-600">
          Report an AI safety incident with evidence. All submissions are
          recorded on-chain and stored on IPFS for transparency.
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow">
        <IncidentForm />
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Provide clear, factual information about the incident</li>
          <li>• Include reproducible steps when possible</li>
          <li>• Upload relevant evidence (screenshots, logs, etc.)</li>
          <li>• Be specific about the model and incident type</li>
          <li>• Your submission will be immutable once recorded on-chain</li>
        </ul>
      </div>
    </div>
  );
}
