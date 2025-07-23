"use client";

import { useState, useEffect } from 'react';
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
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    // Fetches the incident data for the timeline markers
    fetch('/api/incidents/all')
      .then(res => res.json())
      .then((data: Incident[]) => setIncidents(data));
  }, []);

  // This new useEffect creates a timer that moves the yellow line when isPlaying is true
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setPlaybackPosition(prevPos => {
          // Increment position and loop back to 0 if it reaches 100
          const newPos = prevPos + 0.1;
          return newPos >= 100 ? 0 : newPos;
        });
      }, 100); // The timer updates every 100 milliseconds

      // This cleans up the timer when you pause or the component unmounts
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

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