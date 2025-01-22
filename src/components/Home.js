import React, { useState, useEffect } from "react";
import SongsList from "../components/SongsList";
import MusicPlayer from "../components/MusicPlayer";
import { ReactComponent as Logo } from "../assets/Logo.svg";
import { ReactComponent as User } from "../assets/User.svg";

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    const response = await fetch("https://cms.samespace.com/items/songs");
    const data = await response.json();
    setSongs(data.data);
  };

  const handleSongSelect = (song) => {
    setCurrentSong(song);
  };

  return (
    <div className="relative bg-custom-gradient flex min-h-screen text-white">
      <div className="absolute top-10 left-10 cursor-pointer">
        <Logo />
      </div>

      {/* Main Content Centered */}
      <div className="flex justify-between px-24 m-10 mx-auto items-center gap-36">
        {/* Left - Song List */}
        <div className="w-[440px] h-[800px] overflow-auto p-4 ml-12">
          <SongsList songs={songs} onSongSelect={handleSongSelect} />
        </div>

        {/* Right - Music Player */}
        <div className="w-[640px] h-[700px] rounded-lg shadow-lg p-6">
          <MusicPlayer song={currentSong} />
        </div>
      </div>

      <div className="absolute bottom-10 left-10 cursor-pointer">
        <User />
      </div>
    </div>
  );
};

export default Home;
