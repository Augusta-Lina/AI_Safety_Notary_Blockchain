"use client";

import { useState, useMemo } from "react";
import { useIncidents } from "@/lib/eas/hooks";
import { IncidentCard } from "@/components/ui/IncidentCard";
import { IncidentType, SeverityLevel } from "@/lib/types";

export const dynamic = "force-dynamic";

export default function IncidentsPage() {
  const { data: incidents, isLoading } = useIncidents();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<IncidentType | "all">("all");
  const [filterSeverity, setFilterSeverity] = useState<SeverityLevel | "all">("all");
  const [filterVerified, setFilterVerified] = useState<"all" | "verified" | "unverified">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "severity">("newest");

  const filteredIncidents = useMemo(() => {
    if (!incidents) return [];

    let filtered = [...incidents];

    if (searchTerm) {
      filtered = filtered.filter(
        (i) =>
          i.modelIdentifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((i) => i.incidentType === filterType);
    }

    if (filterSeverity !== "all") {
      filtered = filtered.filter((i) => i.severityLevel === filterSeverity);
    }

    if (filterVerified === "verified") {
      filtered = filtered.filter((i) => i.verified);
    } else if (filterVerified === "unverified") {
      filtered = filtered.filter((i) => !i.verified);
    }

    if (sortBy === "newest") {
      filtered.sort((a, b) => Number(b.timestamp - a.timestamp));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => Number(a.timestamp - b.timestamp));
    } else if (sortBy === "severity") {
      filtered.sort((a, b) => b.severityLevel - a.severityLevel);
    }

    return filtered;
  }, [incidents, searchTerm, filterType, filterSeverity, filterVerified, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        All Incidents ({filteredIncidents.length})
      </h1>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by model or description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as IncidentType | "all")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="bias">Bias</option>
              <option value="hallucination">Hallucination</option>
              <option value="safety-violation">Safety Violation</option>
              <option value="data-leak">Data Leak</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity
            </label>
            <select
              value={filterSeverity}
              onChange={(e) =>
                setFilterSeverity(
                  e.target.value === "all" ? "all" : (Number(e.target.value) as SeverityLevel)
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="1">1 - Minor</option>
              <option value="2">2 - Low</option>
              <option value="3">3 - Medium</option>
              <option value="4">4 - High</option>
              <option value="5">5 - Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterVerified}
              onChange={(e) => setFilterVerified(e.target.value as "all" | "verified" | "unverified")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredIncidents.length} incident(s)
          </div>
          <div>
            <label className="inline-block text-sm font-medium text-gray-700 mr-2">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "severity")}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="severity">Highest Severity</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-600">Loading incidents...</div>
      ) : filteredIncidents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600">No incidents match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredIncidents.map((incident) => (
            <IncidentCard key={incident.uid} incident={incident} />
          ))}
        </div>
      )}
    </div>
  );
}
