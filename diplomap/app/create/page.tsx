"use client";
import React from "react";
import Map from "../../components/ui/map/map";

const CreateTrip = () => {
  return (
    <>
      <span className="font-bold text-4xl">Create Trip</span>
      <Map />
      <div id="map"></div>
    </>
  );
};

export default CreateTrip;
