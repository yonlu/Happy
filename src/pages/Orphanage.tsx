import React, { useEffect, useState } from "react";
import { FiClock, FiInfo } from "react-icons/fi";
import { Map, Marker } from "react-leaflet";
import ReactLeafletGoogleLayer from "react-leaflet-google-layer";
import { useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";

import "../styles/pages/orphanage.css";

interface Orphanage {
  latitude: number;
  longitude: number;
  name: string;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  images: Array<{
    id: number;
    url: string;
  }>;
}

interface OrphanageParams {
  id: string;
}

export default function Orphanage() {
  const params = useParams<OrphanageParams>();
  const [orphanage, setOrphanage] = useState<Orphanage>();
  const [activeImageIndex, setActiveIndexImage] = useState(0);

  useEffect(() => {
    api.get(`orphanages/${params.id}`).then((response) => {
      setOrphanage(response.data);
    });
  }, [params.id]);

  if (!orphanage) {
    return <p>Loading...</p>;
  }

  return (
    <div id="page-orphanage">
      <Sidebar />
      <main>
        <div className="orphanage-details">
          <img
            src={orphanage.images[activeImageIndex].url}
            alt={orphanage.name}
          />

          <div className="images">
            {orphanage.images.map((image, index) => {
              return (
                <button
                  key={image.id}
                  className={activeImageIndex === index ? "active" : ""}
                  type="button"
                  onClick={() => setActiveIndexImage(index)}
                >
                  <img src={image.url} alt={orphanage.name} />
                </button>
              );
            })}
          </div>

          <div className="orphanage-details-content">
            <h1>{orphanage.name}</h1>
            <p>{orphanage.about}</p>

            <div className="map-container">
              <Map
                center={[orphanage.latitude, orphanage.longitude]}
                zoom={14}
                style={{ width: "100%", height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <ReactLeafletGoogleLayer
                  googleMapsLoaderConf={{
                    KEY: `${process.env.REACT_APP_GOOGLE_API}`,
                  }}
                  type={"roadmap"}
                />
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[orphanage.latitude, orphanage.longitude]}
                />
              </Map>

              <footer>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}
                >
                  See how to get there!
                </a>
              </footer>
            </div>

            <hr />

            <h2>Visiting instructions</h2>
            <p>{orphanage.instructions}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Monday to Friday <br />
                {orphanage.opening_hours}
              </div>
              {orphanage.open_on_weekends ? (
                <div className="open-on-weekends">
                  <FiInfo size={32} color="#39CC83" />
                  This orphanage is open on weekends.
                </div>
              ) : (
                <div className="open-on-weekends dont-open">
                  <FiInfo size={32} color="#FF669D" />
                  This orphanage is closed on weekends.
                </div>
              )}
            </div>
            {/* 
            <button type="button" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </button> */}
          </div>
        </div>
      </main>
    </div>
  );
}
