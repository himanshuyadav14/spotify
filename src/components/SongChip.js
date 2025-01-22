import React, { useState, useEffect } from "react";

const SongChip = ({ data }) => {
    console.log(data);
  return (
    <div className="flex justify-between items-center p-4 hover:bg-[#FFFFFF14] rounded-lg cursor-pointer">
      <div className="flex gap-4 items-center">
        <div>
          <img
            src={`https://cms.samespace.com/assets/${data.cover}`}
            alt={`${data.name || "Song"} cover`}
            className="w-12 h-12 rounded-full"
          />
        </div>
        <div>
          <h3 className="text-white">{data.name}</h3>
          <p className="text-gray-400">{data.artist}</p>
        </div>
      </div>
      <div>
        <p className="text-gray-300">{data.duration}</p>
      </div>
    </div>
  );
};

export default SongChip;
