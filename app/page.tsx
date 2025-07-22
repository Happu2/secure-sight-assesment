"use client";

import { useState, useEffect, useRef } from 'react';
import IncidentList from '@/components/IncidentList';
import IncidentPlayer from '@/components/IncidentPlayer';
import IncidentTimeline from '@/components/IncidentTimeline';

// Define the type for an incident
type Incident = {
  id: string;
  type: string;
  tsStart: string;
  camera: { id: string; name: string; };
};

export default function DashboardPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  // FIX: Initialize playback position at 0
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // This now only fetches the incident data for the timeline markers
    fetch('/api/incidents/all')
      .then(res => res.json())
      .then((data: Incident[]) => setIncidents(data));
      // FIX: Removed logic that automatically set the position on load
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <nav className="bg-black p-4 flex justify-between items-center border-b border-gray-700">
        <h1 className="text-xl font-bold">MANDLACX</h1>
        <div className="text-gray-400">Dashboard | Cameras | Scenes | Incidents</div>
        <div>Mohammed Ajhas</div>
      </nav>
      <main className="flex-grow p-4 flex gap-4">
        <div className="w-2/3 flex flex-col">
          <div className="flex-grow">
            <IncidentPlayer
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              playbackPosition={playbackPosition}
            />
          </div>
          <IncidentTimeline
            incidents={incidents}
            playbackPosition={playbackPosition}
            setPlaybackPosition={setPlaybackPosition}
          />
        </div>
        <div className="w-1/3">
          <IncidentList />
        </div>
      </main>
    </div>
  );
}