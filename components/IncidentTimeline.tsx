// components/IncidentTimeline.tsx

"use client";

import { useRef, useMemo, ReactNode } from 'react';
import { AlertTriangle, Video, Ear, ShieldQuestion, TrafficCone } from 'lucide-react';

// --- TYPE DEFINITIONS ---
type Camera = {
  id: string;
  name: string;
};
type Incident = {
  id: string;
  type: string;
  tsStart: string;
  camera: Camera;
};
interface TimelineProps {
    incidents: Incident[];
    playbackPosition: number;
    setPlaybackPosition: (position: number) => void;
}

// --- STYLING HELPERS ---
const typeDetails: { [key: string]: { color: string; icon: ReactNode } } = {
  'Unauthorised Access': { color: '#ef4444', icon: <ShieldQuestion size={12} className="text-white" /> },
  'Gun Threat': { color: '#f97316', icon: <AlertTriangle size={12} className="text-white" /> },
  'Face Recognised': { color: '#3b82f6', icon: <Video size={12} className="text-white" /> },
  'Traffic Congestion': { color: '#eab308', icon: <TrafficCone size={12} className="text-white" /> },
  'Default': { color: '#a855f7', icon: <Ear size={12} className="text-white" /> },
};

// --- COMPONENT ---
export default function IncidentTimeline({ incidents, playbackPosition, setPlaybackPosition }: TimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const isDraggingRef = useRef(false);

  // Group incidents by camera ID for multi-track rendering
  const { groupedIncidents, cameras } = useMemo(() => {
    const grouped = incidents.reduce((acc, incident) => {
      const camId = incident.camera.id;
      if (!acc[camId]) acc[camId] = [];
      acc[camId].push(incident);
      return acc;
    }, {} as { [key: string]: Incident[] });
    
    const uniqueCameras = incidents.reduce((acc, incident) => {
      if (!acc.some(cam => cam.id === incident.camera.id)) {
        acc.push(incident.camera);
      }
      return acc;
    }, [] as Camera[]);

    return { groupedIncidents: grouped, cameras: uniqueCameras };
  }, [incidents]);

  const getPercentageOfDay = (dateString: string) => {
    const date = new Date(dateString);
    const totalMinutes = date.getHours() * 60 + date.getMinutes();
    return (totalMinutes / (24 * 60)) * 100;
  };

  // --- MOUSE HANDLERS FOR DRAGGING ---
  const handleMouseDown = () => isDraggingRef.current = true;
  const handleMouseUp = () => isDraggingRef.current = false;
  const handleMouseLeave = () => isDraggingRef.current = false;

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!isDraggingRef.current || !svgRef.current) return;
    const timelineRect = svgRef.current.getBoundingClientRect();
    const leftMargin = 100;
    const timelineWidth = timelineRect.width - leftMargin;
    const newX = event.clientX - timelineRect.left - leftMargin;
    const percentage = (newX / timelineWidth) * 100;
    setPlaybackPosition(Math.max(0, Math.min(100, percentage)));
  };

  // --- DYNAMIC SVG SIZING ---
  const rowHeight = 40;
  const headerHeight = 30;
  const leftMargin = 100;
  const svgWidth = svgRef.current?.clientWidth || 0;
  const timelineWidth = svgWidth > 0 ? svgWidth - leftMargin : 0;
  const svgHeight = headerHeight + (cameras.length * rowHeight);

  return (
    <div className="bg-black p-4 rounded-lg mt-4 text-gray-400">
      <h3 className="text-lg font-bold mb-2 text-white">Camera List</h3>
      <div className="w-full relative">
        <svg
          ref={svgRef}
          width="100%"
          height={svgHeight}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown} // Allow clicking anywhere on timeline to set position
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {timelineWidth > 0 && Array.from({ length: 24 }).map((_, i) => (
            <g key={i} transform={`translate(${leftMargin + (i / 24) * timelineWidth}, 0)`}>
              <line y1={15} y2={25} stroke="#6b7280" strokeWidth="1" />
              <text x="-10" y="10" fill="#9ca3af" fontSize="10">{String(i).padStart(2, '0')}:00</text>
            </g>
          ))}
          {cameras.map((camera, index) => {
            const yPos = headerHeight + (index * rowHeight);
            return (
              <g key={camera.id} transform={`translate(0, ${yPos})`}>
                <text x="5" y="25" fill="#e5e7eb" fontSize="12" fontWeight="bold">{camera.name}</text>
                <line x1={leftMargin} y1="20" x2="100%" y2="20" stroke="#4b5563" strokeWidth="1" />
                {(groupedIncidents[camera.id] || []).map(incident => {
                  const details = typeDetails[incident.type] || typeDetails['Default'];
                  const percentOfDay = getPercentageOfDay(incident.tsStart);
                  const xPos = leftMargin + (percentOfDay / 100) * timelineWidth;
                  return (
                    <g key={incident.id} transform={`translate(${xPos}, 10)`}>
                      <rect width="150" height="20" fill={details.color} rx="3" />
                      <g transform="translate(5, 3)">{details.icon}</g>
                      <text x="25" y="14" fill="white" fontSize="10">{incident.type}</text>
                    </g>
                  );
                })}
              </g>
            );
          })}
          {/* Scrubber now uses playbackPosition prop */}
          <g transform={`translate(${leftMargin + (playbackPosition / 100) * timelineWidth}, 0)`} onMouseDown={handleMouseDown} style={{ cursor: 'grab' }}>
            <line y1="15" y2={svgHeight} stroke="#facc15" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}