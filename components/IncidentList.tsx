// src/components/IncidentList.tsx

"use client";

import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

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
  // 1. Add state for the resolved count
  const [resolvedCount, setResolvedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both the unresolved list and the resolved count at the same time
        const [incidentsRes, countRes] = await Promise.all([
          fetch('/api/incidents?resolved=false'),
          fetch('/api/incidents/count?resolved=true') // 2. Fetch the initial resolved count
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
    // 3. Increment the count when an incident is resolved
    setResolvedCount(prevCount => prevCount + 1);

    try {
      const response = await fetch(`/api/incidents/${incidentId}/resolve`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error('Failed to resolve incident on the server.');
      }
    } catch (error) {
      console.error(error);
      // Revert UI if the API call fails
      setIncidents(originalIncidents);
      setResolvedCount(prevCount => prevCount - 1); // Decrement count on failure
      alert('Failed to resolve incident. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading incidents...</div>;
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
            {/* 4. Display the dynamic count in the button */}
            {resolvedCount} resolved incidents
        </button>
      </div>

      <ul className="space-y-3">
        {incidents.map((incident) => (
          <li key={incident.id} className="bg-gray-700 p-2 rounded-md flex items-center gap-4">
            <img src={incident.thumbnailUrl} alt={incident.type} className="w-24 h-16 object-cover rounded" />
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