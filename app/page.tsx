"use client";

import Link from "next/link";
import { useIncidents } from "@/lib/eas/hooks";
import { IncidentCard } from "@/components/ui/IncidentCard";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const { data: incidents, isLoading } = useIncidents();

  const stats = {
    total: incidents?.length || 0,
    verified: incidents?.filter((i) => i.verified).length || 0,
    critical: incidents?.filter((i) => i.severityLevel >= 4).length || 0,
  };

  const recentIncidents = incidents?.slice(0, 5) || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-6">
            Global AI Safety Notary
          </h1>
          <p className="text-xl mb-8 max-w-3xl">
            Decentralized registry for AI safety incidents. Built on Ethereum
            Attestation Service for immutable, verifiable, and transparent
            incident tracking.
          </p>
          <div className="flex space-x-4">
            <Link
              href="/submit"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Submit Incident
            </Link>
            <Link
              href="/incidents"
              className="px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition border border-white"
            >
              View All Incidents
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.total}
            </div>
            <div className="text-gray-600">Total Incidents</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.verified}
            </div>
            <div className="text-gray-600">Verified Incidents</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {stats.critical}
            </div>
            <div className="text-gray-600">Critical Incidents</div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recent Incidents
          </h2>
          {isLoading ? (
            <div className="text-center py-12 text-gray-600">
              Loading incidents...
            </div>
          ) : recentIncidents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 mb-4">
                No incidents reported yet. Be the first to contribute!
              </p>
              <Link
                href="/submit"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit First Incident
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {recentIncidents.map((incident) => (
                <IncidentCard key={incident.uid} incident={incident} />
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl mb-3">1️⃣</div>
              <h3 className="text-lg font-semibold mb-2">Report Incident</h3>
              <p className="text-gray-600">
                Submit AI safety incidents with detailed evidence stored on IPFS.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-3">2️⃣</div>
              <h3 className="text-lg font-semibold mb-2">On-Chain Record</h3>
              <p className="text-gray-600">
                Each incident becomes an immutable attestation on Ethereum.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-3">3️⃣</div>
              <h3 className="text-lg font-semibold mb-2">Community Verify</h3>
              <p className="text-gray-600">
                Anyone can verify incidents, building a trustworthy registry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
