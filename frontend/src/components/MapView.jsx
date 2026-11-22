// export default MapView;
import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Circle,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatDistance } from "../utils/distance";

// Search circle shown around the customer, and how far the map may wander.
const RADIUS_METERS = 5000;
const START_ZOOM = 13;
const MIN_ZOOM = 12; // can zoom out one level from the starting view
const BOUNDS_SIZE_METERS = 16000; // a bit larger than the 10 km circle

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

// Button that brings the map back to the starting view (user + circle).
function RecenterButton({ position }) {
  const map = useMap();
  const buttonRef = useRef(null);

  // Stop clicks on the button from also dragging/clicking the map.
  useEffect(() => {
    if (buttonRef.current) {
      L.DomEvent.disableClickPropagation(buttonRef.current);
    }
  }, []);

  return (
    <button
      ref={buttonRef}
      type="button"
      className="recenter-btn"
      title="Back to my location"
      aria-label="Back to my location"
      onClick={() =>
        map.flyTo([position.lat, position.lng], START_ZOOM, { duration: 0.6 })
      }
    >
      ◎
    </button>
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

// Fits the map bounds to show both points — used for the route view.
function FitToRoute({ from, to }) {
  const map = useMap();
  useEffect(() => {
    if (from && to) {
      map.fitBounds(
        [
          [from.lat, from.lng],
          [to.lat, to.lng],
        ],
        { padding: [60, 60] },
      );
    }
  }, [from, to, map]);
  return null;
}

const MapView = ({
  userPosition,
  providers,
  selectedProviderId,
  onSelectProvider,
  showRoute = false,
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

  // The route view (Tracking page) needs the full freedom to fit both
  // points, so the "stay near the circle" limits only apply to the
  // provider-search map.
  const limits = showRoute
    ? {}
    : {
        minZoom: MIN_ZOOM,
        maxBounds: L.latLng(userPosition.lat, userPosition.lng).toBounds(
          BOUNDS_SIZE_METERS,
        ),
        maxBoundsViscosity: 1.0,
      };

  return (
    <MapContainer
      center={[userPosition.lat, userPosition.lng]}
      zoom={START_ZOOM}
      className="map-canvas"
      {...limits}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <UserMarker position={userPosition} />

      {!showRoute && (
        <Circle
          center={[userPosition.lat, userPosition.lng]}
          radius={RADIUS_METERS}
          pathOptions={{
            color: "#355872",
            fillColor: "#9cd5ff",
            fillOpacity: 0.15,
          }}
        />
      )}

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

      {showRoute && selected && (
        <>
          <Polyline
            positions={[
              [userPosition.lat, userPosition.lng],
              [selected.lat, selected.lng],
            ]}
            pathOptions={{
              color: "#355872",
              weight: 4,
              dashArray: "8 10",
              opacity: 0.8,
            }}
          />
          <FitToRoute from={userPosition} to={selected} />
        </>
      )}

      {!showRoute && <FlyToSelection target={selected} />}
      {!showRoute && <RecenterButton position={userPosition} />}
    </MapContainer>
  );
};

export default MapView;
