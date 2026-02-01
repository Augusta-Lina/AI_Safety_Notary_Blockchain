"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IncidentType,
  SeverityLevel,
  ReporterRole,
  SafetyIncident,
} from "@/lib/types";
import { useCreateAttestation } from "@/lib/eas/hooks";

export function IncidentForm() {
  const router = useRouter();
  const { mutate: createAttestation, isPending, isSuccess, txHash } = useCreateAttestation();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [incidentType, setIncidentType] = useState<IncidentType>("hallucination");
  const [modelIdentifier, setModelIdentifier] = useState("");
  const [severityLevel, setSeverityLevel] = useState<SeverityLevel>(3);
  const [description, setDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [reporterRole, setReporterRole] = useState<ReporterRole>("user");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (step < 3) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3);
      return;
    }

    try {
      const incidentData: SafetyIncident = {
        incidentType,
        modelIdentifier,
        severityLevel,
        description,
        evidenceHash: "",
        timestamp: BigInt(Math.floor(Date.now() / 1000)),
        reporterRole,
        verified: false,
        mitigationStatus: "pending",
      };

      createAttestation(incidentData, {
        onSuccess: (uid) => {
          setTimeout(() => {
            router.push(`/incidents/${uid}`);
          }, 2000);
        },
      });
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit incident. Please try again.");
    }
  }

  if (isSuccess && txHash) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="text-2xl font-bold text-green-900 mb-4">
          Incident Submitted Successfully!
        </h2>
        <p className="text-green-800 mb-4">
          Your incident has been recorded on-chain with attestation UID:
        </p>
        <code className="block bg-white p-3 rounded text-sm mb-4 break-all">
          {txHash}
        </code>
        <p className="text-green-700">Redirecting to incident details...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                s === step
                  ? "bg-blue-600 text-white"
                  : s < step
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {s}
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          Step {step} of 3
        </div>
      </div>

      {step === 1 && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Incident Type *
            </label>
            <select
              required
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value as IncidentType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="bias">Bias</option>
              <option value="hallucination">Hallucination</option>
              <option value="safety-violation">Safety Violation</option>
              <option value="data-leak">Data Leak</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Identifier *
            </label>
            <input
              required
              type="text"
              value={modelIdentifier}
              onChange={(e) => setModelIdentifier(e.target.value)}
              placeholder="e.g., gpt-4-turbo, claude-3-opus"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity Level: {severityLevel}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={severityLevel}
              onChange={(e) => setSeverityLevel(Number(e.target.value) as SeverityLevel)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 - Minor</span>
              <span>3 - Medium</span>
              <span>5 - Critical</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brief Description * (max 500 chars)
            </label>
            <textarea
              required
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-xs text-gray-500 mt-1">
              {description.length}/500
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description
            </label>
            <textarea
              value={detailedDescription}
              onChange={(e) => setDetailedDescription(e.target.value)}
              rows={6}
              placeholder="Provide detailed information about the incident, steps to reproduce, context, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reporter Role *
            </label>
            <select
              required
              value={reporterRole}
              onChange={(e) => setReporterRole(e.target.value as ReporterRole)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="researcher">Researcher</option>
              <option value="engineer">Engineer</option>
              <option value="auditor">Auditor</option>
              <option value="other">Other</option>
            </select>
          </div>
        </>
      )}

      {step === 3 && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Review Your Submission</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="text-sm text-gray-900">{incidentType}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Model</dt>
              <dd className="text-sm text-gray-900">{modelIdentifier}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Severity</dt>
              <dd className="text-sm text-gray-900">{severityLevel}/5</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="text-sm text-gray-900">{description}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Reporter Role</dt>
              <dd className="text-sm text-gray-900">{reporterRole}</dd>
            </div>
          </dl>
        </div>
      )}

      <div className="flex justify-between">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
            disabled={isPending}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending
            ? "Processing..."
            : step === 3
            ? "Submit Incident"
            : "Next"}
        </button>
      </div>
    </form>
  );
}
