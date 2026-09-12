import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatDistance } from "../utils/distance";

// Colored marker set (blue = user, green = provider default, violet = selected)
const ICON_BASE =
  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img";

const userIcon = new L.Icon({
  iconUrl: `${ICON_BASE}/marker-icon-2x-blue.png`,
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const providerIcon = (highlighted) =>
  new L.Icon({
    iconUrl: highlighted
      ? `${ICON_BASE}/marker-icon-2x-violet.png`
      : `${ICON_BASE}/marker-icon-2x-green.png`,
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: highlighted ? [32, 52] : [25, 41],
    iconAnchor: highlighted ? [16, 52] : [12, 41],
    className: highlighted
      ? "provider-marker provider-marker--active"
      : "provider-marker",
  });

// Flies the map to a target position when called.
function useFlyTo() {
  const map = useMap();
  return (position) => {
    map.flyTo([position.lat, position.lng], Math.max(map.getZoom(), 14), {
      duration: 0.6,
    });
  };
}

// User's own marker — flies the map to itself when clicked.
function UserMarker({ position }) {
  const flyTo = useFlyTo();
  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={userIcon}
      eventHandlers={{
        click: () => flyTo(position),
      }}
    >
      <Tooltip direction="top">You are here</Tooltip>
    </Marker>
  );
}

// Recenters the map whenever the selected provider changes.
function FlyToSelection({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 14), {
        duration: 0.6,
      });
    }
  }, [target, map]);
  return null;
}

const MapView = ({
  userPosition,
  providers,
  selectedProviderId,
  onSelectProvider,
}) => {
  if (!userPosition) {
    return (
      <div className="map-placeholder">
        <p>Waiting for your location…</p>
        <span>Allow location access to see providers near you.</span>
      </div>
    );
  }

  const selected = providers.find((p) => p.id === selectedProviderId) || null;

  return (
    <MapContainer
      center={[userPosition.lat, userPosition.lng]}
      zoom={13}
      className="map-canvas"
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <UserMarker position={userPosition} />

      <Circle
        center={[userPosition.lat, userPosition.lng]}
        radius={5000}
        pathOptions={{
          color: "#355872",
          fillColor: "#9cd5ff",
          fillOpacity: 0.15,
        }}
      />

      {providers.map((provider) => {
        const dist = formatDistance(provider.distanceMeters);
        return (
          <Marker
            key={provider.id}
            position={[provider.lat, provider.lng]}
            icon={providerIcon(provider.id === selectedProviderId)}
            eventHandlers={{
              click: () => onSelectProvider(provider.id),
            }}
          >
            <Tooltip direction="top">
              {provider.name}
              {dist ? ` — ${dist} away` : ""}
            </Tooltip>
          </Marker>
        );
      })}

      <FlyToSelection target={selected} />
    </MapContainer>
  );
};

export default MapView;
