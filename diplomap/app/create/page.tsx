"use client";
import React from "react";
import Map from "../../components/ui/map/map";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CreateTrip = () => {
  return (
    <>
      <span className="font-semibold text-4xl mb-4">Створити подорож</span>
      <Map />
      <div id="map"></div>
      <Link href="/my-trips">
        <Button>Back</Button>
      </Link>
    </>
  );
};

export default CreateTrip;
