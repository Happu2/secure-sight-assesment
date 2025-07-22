// src/components/IncidentList.tsx

"use client";

import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import Image from 'next/image'; // FIX: Import the Next.js Image component

// Define the types for our data
type Camera = {
  id: string;
  name: string;
  location: string;
};

type Incident = {
  id: string;
  type: string;
  tsStart: string;
  tsEnd: string;
  thumbnailUrl: string;
  resolved: boolean;
  cameraId: string;
  camera: Camera;
};

// Helper to format time from a full Date string
const formatTime = (dateString: string) => 
  new Date(dateString).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

export default function IncidentList() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incidentsRes, countRes] = await Promise.all([
          fetch('/api/incidents?resolved=false'),
          fetch('/api/incidents/count?resolved=true')
        ]);
        
        const incidentsData = await incidentsRes.json();
        const countData = await countRes.json();

        setIncidents(incidentsData);
        setResolvedCount(countData.count);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleResolve = async (incidentId: string) => {
    const originalIncidents = incidents;
    setIncidents(currentIncidents => currentIncidents.filter(inc => inc.id !== incidentId));
    setResolvedCount(prevCount => prevCount + 1);

    try {
      const response = await fetch(`/api/incidents/${incidentId}/resolve`, { method: 'PATCH' });
      if (!response.ok) {
        throw new Error('Failed to resolve incident on the server.');
      }
    } catch (error) {
      console.error(error);
      setIncidents(originalIncidents);
      setResolvedCount(prevCount => prevCount - 1);
      alert('Failed to resolve incident. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading incidents...</div>;
  }

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={24} />
            <h2 className="text-lg font-bold">{incidents.length} Unresolved Incidents</h2>
        </div>
        <button className="flex items-center gap-2 text-gray-400 border border-gray-600 px-3 py-1 rounded-full text-sm">
            <CheckCircle className="text-green-500" size={16} />
            {resolvedCount} resolved incidents
        </button>
      </div>

      <ul className="space-y-3">
        {incidents.map((incident) => (
          <li key={incident.id} className="bg-gray-700 p-2 rounded-md flex items-center gap-4">
            {/* FIX: Replaced <img> with next/image <Image> for optimization */}
            <Image
              src={incident.thumbnailUrl}
              alt={incident.type}
              width={96}  // Required for next/image
              height={64} // Required for next/image
              className="w-24 h-16 object-cover rounded"
            />
            <div className="flex-grow">
              <p className="font-semibold text-red-500">{incident.type}</p>
              <p className="text-sm text-gray-400">{incident.camera.location}</p>
              <p className="text-sm text-gray-400">
                {formatTime(incident.tsStart)} - {formatTime(incident.tsEnd)}
              </p>
            </div>
            <button
              onClick={() => handleResolve(incident.id)}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Resolve &gt;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}