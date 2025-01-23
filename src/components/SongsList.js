import React, { useState, useEffect } from "react";
import { ReactComponent as Search } from "../assets/Search.svg";
import SongChip from "./SongChip";

const SongsList = ({ songs, onSongSelect, currentSong }) => {
  const [songsWithDuration, setSongsWithDuration] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("For You");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDurations = async () => {
      const updatedSongs = await Promise.all(
        songs.map(async (song) => {
          const duration = await fetchDuration(song.url);
          return { ...song, duration };
        })
      );
      setSongsWithDuration(updatedSongs);
    };

    fetchDurations();
  }, [songs]);

  const fetchDuration = (url) => {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.addEventListener("loadedmetadata", () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        resolve(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
      });
    });
  };

  const filteredSongs =
    selectedCategory === "Top Tracks"
      ? songsWithDuration.filter((song) => song.top_track)
      : songsWithDuration;

  const searchFilteredSongs = filteredSongs.filter(
    (song) =>
      song?.name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      song?.artist?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  const handleSongSelect = (song) => {
    onSongSelect(song);
  };

  return (
    <div className="flex flex-col gap-4 h-full max-h-[calc(100vh-200px)]">
      <div className="flex gap-[40px] text-[24px] font-bold leading-[32px] text-left decoration-skip-ink-none flex-wrap justify-center lg:justify-start sticky top-0 z-10">
        <div
          className={`cursor-pointer ${
            selectedCategory === "For You" ? "text-white" : "opacity-50"
          }`}
          onClick={() => setSelectedCategory("For You")}
        >
          For You
        </div>
        <div
          className={`cursor-pointer ${
            selectedCategory === "Top Tracks" ? "text-white" : "opacity-50"
          }`}
          onClick={() => setSelectedCategory("Top Tracks")}
        >
          Top Tracks
        </div>
      </div>
      <div className="relative w-full sm:w-[400px] h-[48px] p-2 bg-[#FFFFFF14] rounded-lg flex items-center mt-4 sticky top-16 z-10">
        <input
          type="text"
          placeholder="Search Song, Artist"
          className="w-full h-full bg-transparent text-gray-400 placeholder:text-gray-400 pl-4 pr-12 rounded-lg focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute right-3 cursor-pointer">
          <Search className="text-gray-400" />
        </div>
      </div>
      <div className="overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {!songsWithDuration.length ? (
          <div className="space-y-4">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 animate-pulse justify-between"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="flex flex-col space-y-2">
                    <div className="w-44 h-4 bg-gray-300 rounded"></div>
                    <div className="w-24 h-4 bg-gray-400 rounded"></div>
                  </div>
                </div>

                <div className="w-12 h-4 bg-gray-400 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {searchFilteredSongs.map((song) => (
              <SongChip
                key={song.id}
                data={song}
                onClick={() => handleSongSelect(song)}
                isSelected={currentSong?.id === song.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SongsList;