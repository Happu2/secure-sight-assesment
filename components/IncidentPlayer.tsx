// components/IncidentPlayer.tsx

"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface IncidentPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  playbackPosition: number;
}

// Data for all available camera views
const cameraFeeds = [
  { name: 'Vault Camera', src: '/videoplayback.mp4' },
  { name: 'Camera - 02', src: '/videoPlay.mp4' },
  { name: 'Camera - 03', src: '/videoplayback3.mp4' },
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
  
  // State to track the main video and the two thumbnails
  const [mainFeed, setMainFeed] = useState(cameraFeeds[0]);
  const [thumbnailFeeds, setThumbnailFeeds] = useState([cameraFeeds[1], cameraFeeds[2]]);

  // This effect synchronizes the play/pause state with the video element
  useEffect(() => {
    if (videoRef.current) {
        if (isPlaying) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    }
  }, [isPlaying, mainFeed]); // Re-run if the main feed changes

  // Function to handle swapping videos when a thumbnail is clicked
  const handleThumbnailClick = (clickedFeed: typeof cameraFeeds[0]) => {
    const currentMainFeed = mainFeed;
    // The new main feed is the one that was clicked
    setMainFeed(clickedFeed);
    // The new thumbnails are the old main feed plus the other non-clicked thumbnail
    setThumbnailFeeds(cameraFeeds.filter(feed => feed.name !== clickedFeed.name));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-900 rounded-lg flex-grow relative overflow-hidden">
        {/* The `key` prop is crucial here. It forces React to re-create the video element 
            when the src changes, ensuring the new video loads correctly. */}
        <video
          key={mainFeed.src}
          ref={videoRef}
          src={mainFeed.src}
          loop
          muted
          autoPlay={isPlaying} // Autoplay if the state is already 'playing'
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
        {/* Thumbnails are now rendered dynamically with onClick handlers */}
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
                className="w-full h-full object-cover pointer-events-none" // pointer-events-none to pass clicks to the div
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