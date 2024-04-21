'use client'
import { useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import MapboxDirections  from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';


export default function Map() {
    useEffect(() => {
        mapboxgl.accessToken = `${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-122.4376, 37.7577], // Початкові координати довготи і широти
            zoom: 8 // Початковий зум
        });
     
 const nav = new mapboxgl.NavigationControl()
 var directions = new MapboxDirections({
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
 })
 map.addControl(directions, 'top-left')
        return () => {
            map.remove(); // Прибираємо карту при відмонтовуванні компонента
        };
    }, []);


    return (<div id="map" style={{ height: "500px", width: "500px" }}></div>);
}
