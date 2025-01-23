import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as ThreeDots } from "../assets/ThreeDots.svg";
import { ReactComponent as Speaker } from "../assets/Speaker.svg";
import { ReactComponent as Prev } from "../assets/Prev.svg";
import { ReactComponent as Next } from "../assets/Next.svg";
import { FaPlay, FaPause } from "react-icons/fa";
import { RiFileMusicLine } from "react-icons/ri";
import { PiSpeakerSimpleSlashFill } from "react-icons/pi";

const MusicPlayer = ({ song, onPrev, onNext }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const defaultSong = {
    name: "No Song Selected",
    artist: "Unknown Artist",
  };
  const currentSong = song || defaultSong;

  // Play/Pause toggle
  const handlePlayPause = () => {
    if (!isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    const audio = audioRef.current;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Update current time when the song is playing
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  // Seek functionality
  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  useEffect(() => {
    if (currentSong.url) {
      const audio = audioRef.current;

      // Update duration on song load
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };

      // Reset playback when the song ends
      audio.onended = () => {
        setIsPlaying(false);
        // onNext(); // Uncomment if onNext is implemented
      };

      audio.play();
      setIsPlaying(true);
    }
  }, [currentSong]);

  return (
    <div className="music-player">
      <div className="flex flex-col gap-2 mb-8 text-left">
        <div className="font-bold text-[32px] leading-9">
          {currentSong.name}
        </div>
        <div className="text-[16px] leading-6 text-gray-400">
          {currentSong.artist}
        </div>
      </div>
      <div>
        {song && (
          <img
            src={`https://cms.samespace.com/assets/${currentSong.cover}`}
            alt={`${currentSong.name} cover`}
            className="w-[480px] h-[480px] rounded-lg"
          />
        )}
        {!song && (
          <RiFileMusicLine className="w-[480px] h-[480px] rounded-lg text-gray-300" />
        )}
      </div>
      <div className="relative w-full h-2 bg-[#1e1e1e] rounded-full mt-8">
        <div
          style={{
            width: `${(currentTime / duration) * 100}%`, // Fill the progress
          }}
          className="absolute top-0 left-0 h-full bg-white rounded-full"
        ></div>
        <input
          type="range"
          min="0"
          max="100"
          value={(currentTime / duration) * 100 || 0}
          onChange={handleSeek}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <audio
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={handleTimeUpdate}
      />
      <div className="flex justify-between items-center mt-8">
        <ThreeDots className="cursor-pointer" />
        <div className="flex items-center gap-8">
          <button onClick={onPrev}>
            <Prev />
          </button>

          <button
            onClick={handlePlayPause}
            className={`w-12 h-12 rounded-full text-center flex items-center justify-center ${
              currentSong.url ? "bg-white" : "bg-gray-300"
            }`}
            disabled={!currentSong.url}
          >
            {isPlaying ? (
              <FaPause className="text-black text-xl" />
            ) : (
              <FaPlay className="text-black text-xl" />
            )}
          </button>
          <button onClick={onNext}>
            <Next />
          </button>
        </div>
        <button onClick={handleMuteToggle}>
          {isMuted ? (
            <div className="w-8 h-8 rounded-full bg-[#121212] flex justify-center items-center">
              <PiSpeakerSimpleSlashFill className="w-4 h-4" />
            </div>
          ) : (
            <Speaker className="w-8 h-8" />
          )}
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
