import React, { useState, useEffect } from "react";
import SongsList from "../components/SongsList";
import MusicPlayer from "../components/MusicPlayer";
import { ReactComponent as Logo } from "../assets/Logo.svg";
import { ReactComponent as User } from "../assets/User.svg";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { FaSpotify } from "react-icons/fa";

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    const response = await fetch("https://cms.samespace.com/items/songs");
    const data = await response.json();
    setSongs(data.data);

    if (data.data.length > 0) {
      setCurrentSong(data.data[0]);
    }
  };

  const handleSongSelect = (song) => {
    setCurrentSong(song);
  };

  const handlePrevSong = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
  };

  const handleNextSong = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
  };

  const getGradientBackground = (accentColor) => {
    return `linear-gradient(108.18deg, ${accentColor} 2.46%, #000000 99.84%)`;
  };

  return (
    <div
      className="relative flex min-h-screen text-white"
      style={{
        backgroundImage: currentSong
          ? getGradientBackground(currentSong.accent)
          : "linear-gradient(108.18deg, #201606 2.46%, #000000 99.84%)",
      }}
    >
      {/* Menu toggle for small screens */}
      <div
        className="cursor-pointer block lg:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <IoClose
            size={40}
            className="absolute top-10 right-10 z-50 text-white" // Added z-50 to ensure visibility
          />
        ) : (
          <FiMenu
            size={40}
            className="absolute top-10 left-10 z-50 text-white" // Ensure menu icon also has consistent z-index
          />
        )}
      </div>

      {/* Fixed Logo for large screens */}
      <div className="absolute top-10 left-10 cursor-pointer hidden lg:block">
        <Logo />
      </div>

      {/* Fixed User Icon */}
      <div className="absolute lg:bottom-10 lg:left-10 lg:top-auto lg:right-auto top-10 right-10 cursor-pointer">
        <User />
      </div>

      {/* Main Content Centered */}
      <div className="flex flex-col lg:flex-row h-full items-center justify-center lg:justify-between lg:px-24 px-6 m-10 mx-auto gap-36">
        {/* Left - Song List */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } lg:block fixed pt-11 p-4 top-0 left-0 z-40 w-full h-full lg:w-[440px] lg:h-[800px] lg:static bg-black lg:bg-transparent overflow-auto lg:p-4 transition-all duration-300 ease-in-out`}
        >
          <SongsList
            songs={songs}
            onSongSelect={handleSongSelect}
            currentSong={currentSong}
          />
        </div>

        {/* Right - Music Player */}
        <div className="w-full max-w-md lg:w-[480px] h-auto lg:h-[750px] rounded-lg p-6">
          <MusicPlayer
            song={currentSong}
            onPrev={handlePrevSong}
            onNext={handleNextSong}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
