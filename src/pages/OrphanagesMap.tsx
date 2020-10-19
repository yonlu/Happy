import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiArrowRight } from "react-icons/fi";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import mapMarkerImg from "../images/map-marker.svg";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";

import "../styles/pages/orphanages-map.css";

interface Orphanage {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}

function OrphanagesMap() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [currentLocation, setCurrentLocation] = useState<number[]>([0, 0]);

  useEffect(() => {
    api.get("orphanages").then((response) => {
      setOrphanages(response.data);
    });

    if ("geolocation" in navigator) {
      console.log("geolocation available");
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      });
    } else {
      console.log("geolocation not available");
    }
  }, []);

  return (
    <div id="page-map">
      <aside>
        <header>
          <img src={mapMarkerImg} alt="Happy marker logo" />

          <h2>Choose an orphanage from the map</h2>
          <p>Many kids are eagerly waiting your visit! :)</p>
        </header>

        <footer>
          <strong>Erie</strong>
          <span>Pennsylvania</span>
        </footer>
      </aside>

      <Map
        center={[currentLocation[0], currentLocation[1]]}
        zoom={12}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {orphanages.map((orphanage) => {
          return (
            <Marker
              key={orphanage.id}
              icon={mapIcon}
              position={[orphanage.latitude, orphanage.longitude]}
            >
              <Popup
                closeButton={false}
                minWidth={240}
                maxWidth={240}
                className="map-popup"
              >
                {orphanage.name}
                <Link to={`/orphanages/${orphanage.id}`}>
                  <FiArrowRight size={20} color="#FFF" />
                </Link>
              </Popup>
            </Marker>
          );
        })}
      </Map>

      <Link to="/orphanages/create" className="create-orphanage">
        <FiPlus size={32} color="#fff" />
      </Link>
    </div>
  );
}

export default OrphanagesMap;
