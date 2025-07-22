// src/components/IncidentPlayer.tsx

"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
interface IncidentPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  playbackPosition: number;
}

const cameraFeeds = [
  { name: 'Vault Camera', src: '/videoplayback.mp4', type: 'video' },
  { name: 'Camera - 02', src: '/videoPlay.mp4', type: 'video' },
  { name: 'Camera - 03', src: '/videoplayback3.mp4', type: 'video' },
];

const formatPositionToTimestamp = (position: number) => {
    const totalMinutes = (position / 100) * 24 * 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.floor((totalMinutes * 60) % 60);
    const d = new Date();
    d.setHours(hours, minutes, seconds);
    return `${d.toLocaleDateString('en-US')} - ${d.toLocaleTimeString('en-GB')}`;
};

export default function IncidentPlayer({ isPlaying, setIsPlaying, playbackPosition }: IncidentPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [mainFeed, setMainFeed] = useState(cameraFeeds[0]);
  const [thumbnailFeeds, setThumbnailFeeds] = useState([cameraFeeds[1], cameraFeeds[2]]);

  useEffect(() => {
    if (videoRef.current) {
        if (isPlaying) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    }
  }, [isPlaying, mainFeed]);

  const handleThumbnailClick = (clickedFeed: typeof cameraFeeds[0]) => {
    // FIX: Removed the unused 'currentMainFeed' variable
    setMainFeed(clickedFeed);
    setThumbnailFeeds(cameraFeeds.filter(feed => feed.name !== clickedFeed.name));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-900 rounded-lg flex-grow relative overflow-hidden">
        <video
          key={mainFeed.src}
          ref={videoRef}
          src={mainFeed.src}
          loop
          muted
          autoPlay={isPlaying}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded">
          <p>📷 {mainFeed.name}</p>
        </div>
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded">
          <p className="text-yellow-400">{formatPositionToTimestamp(playbackPosition)}</p>
        </div>
      </div>
      <div className="bg-black p-4 rounded-b-lg">
        <div className="flex items-center justify-between text-gray-400 mb-4">
            <div className="flex items-center gap-4">
                <button>⏮</button>
                <button onClick={() => setIsPlaying(!isPlaying)} className="text-white text-2xl">
                {isPlaying ? <Pause /> : <Play />}
                </button>
                <button>⏭</button>
            </div>
            <div>{formatPositionToTimestamp(playbackPosition)}</div>
            <div className="flex items-center gap-4">
                <button>🔊</button>
                <button>⚙️</button>
            </div>
        </div>
        <div className="flex gap-2">
          {thumbnailFeeds.map((feed) => (
            <div
              key={feed.name}
              className="w-1/2 relative h-24 overflow-hidden rounded cursor-pointer"
              onClick={() => handleThumbnailClick(feed)}
            >
              <video
                src={feed.src}
                loop
                muted
                autoPlay
                playsInline
                className="w-full h-full object-cover pointer-events-none"
              />
              <p className="absolute bottom-1 left-2 text-xs bg-black bg-opacity-50 px-1 rounded">
                {feed.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}