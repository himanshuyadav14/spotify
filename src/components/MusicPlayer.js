import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as Prev } from "../assets/Prev.svg";
import { ReactComponent as Next } from "../assets/Next.svg";
import { FaPlay, FaPause } from "react-icons/fa";
import { RiFileMusicLine } from "react-icons/ri";
import {
  PiSpeakerSimpleHighFill,
  PiSpeakerSimpleSlashFill,
} from "react-icons/pi";
import { BsThreeDots } from "react-icons/bs";

const MusicPlayer = ({ song, onPrev, onNext }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const defaultSong = {
    name: "No Song Selected",
    artist: "Unknown Artist",
    url: "", // Placeholder URL
    cover: "", // Placeholder cover
  };

  const currentSong = song || defaultSong;

  // Play/Pause toggle
  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Mute/Unmute toggle
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

      // Update duration when metadata is loaded
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };

      // Reset playback state when the song ends
      audio.onended = () => {
        setIsPlaying(false);
        onNext && onNext(); // Call onNext if provided
      };

      // Play the song only if isPlaying is true
      if (isPlaying) {
        const playAudio = async () => {
          try {
            await audio.play();
          } catch (error) {
            console.error(
              "Autoplay blocked. Waiting for user interaction.",
              error
            );
            setIsPlaying(false);
          }
        };

        playAudio();
      } else {
        audio.pause();
      }
    }
  }, [currentSong, onNext, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;

    const playAudio = async () => {
      try {
        await audio.play();
      } catch (error) {
        console.error("Autoplay blocked. Waiting for user interaction.", error);
        setIsPlaying(false);
      }
    };
    setIsPlaying(true);
    playAudio();
  }, [currentSong]);

  return (
    <div className="music-player">
      {/* Song Title and Artist */}
      <div className="flex flex-col gap-2 mb-8 text-left">
        <div className="font-bold text-[32px] leading-9 text-center sm:text-left">
          {currentSong.name}
        </div>
        <div className="text-[16px] leading-6 text-gray-400 text-center sm:text-left">
          {currentSong.artist}
        </div>
      </div>

      {/* Song Cover */}
      <div className="flex justify-center mb-8">
        {currentSong.url ? (
          <img
            src={`https://cms.samespace.com/assets/${
              currentSong.cover || "placeholder.jpg"
            }`}
            alt={`${currentSong.name} cover`}
            className="w-[480px] h-[480px] rounded-lg sm:w-[320px] sm:h-[320px] lg:w-[480px] lg:h-[480px]"
          />
        ) : (
          <RiFileMusicLine className="w-[480px] h-[480px] rounded-lg text-gray-300 sm:w-[320px] sm:h-[320px] lg:w-[480px] lg:h-[480px]" />
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-[#1e1e1e] rounded-full mt-8">
        <div
          style={{
            width: `${duration ? (currentTime / duration) * 100 : 0}%`,
          }}
          className="absolute top-0 left-0 h-full bg-white rounded-full"
        ></div>
        <input
          type="range"
          min="0"
          max="100"
          value={duration ? (currentTime / duration) * 100 : 0}
          onChange={handleSeek}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <audio
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Controls */}
      <div className="flex justify-between items-center mt-8 sm:gap-4 sm:items-center">
        <button className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex justify-center items-center">
          <BsThreeDots />
        </button>

        <div className="flex items-center gap-8">
          <button onClick={onPrev} disabled={!currentSong.url}>
            <Prev />
          </button>

          <button
            onClick={handlePlayPause}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
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

          <button onClick={onNext} disabled={!currentSong.url}>
            <Next />
          </button>
        </div>

        <button
          onClick={handleMuteToggle}
          className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex justify-center items-center"
        >
          {isMuted ? (
            <PiSpeakerSimpleSlashFill className="" />
          ) : (
            <PiSpeakerSimpleHighFill className="" />
          )}
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
