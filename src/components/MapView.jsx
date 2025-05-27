import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
  Autocomplete,
  InfoWindow,
} from '@react-google-maps/api';
import parkingSpots from '../data/parkingSpots';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const libraries = ['places'];

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const MapView = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directions, setDirections] = useState(null);
  const [duration, setDuration] = useState('');
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [nearestSpots, setNearestSpots] = useState([]);
  const [liveTracking, setLiveTracking] = useState(false);

  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);
  const watchIdRef = useRef(null);

  // Get initial location on mount
  useEffect(() => {
    const getInitialLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => console.error('Error fetching location', err),
        { enableHighAccuracy: true }
      );
    };

    getInitialLocation();

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const toggleLiveTracking = () => {
    if (liveTracking) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      setLiveTracking(false);
    } else {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => console.error('Error watching location', err),
        { enableHighAccuracy: true }
      );
      setLiveTracking(true);
    }
  };

  useEffect(() => {
    if (currentLocation) {
      const sorted = parkingSpots
        .filter((spot) => spot.available)
        .map((spot) => ({
          ...spot,
          distance: getDistanceFromLatLonInKm(
            currentLocation.lat,
            currentLocation.lng,
            spot.latitude,
            spot.longitude
          ),
        }))
        .sort((a, b) => a.distance - b.distance);
      setNearestSpots(sorted.slice(0, 5));
    }
  }, [currentLocation]);

  const handleMapClick = useCallback((e) => {
    const dest = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setDestination(dest);
    setSelectedSpot(null);
  }, []);

  useEffect(() => {
    if (currentLocation && destination) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: currentLocation,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
            const route = result.routes[0].legs[0];
            setDuration(route.duration.text);
          } else {
            console.error('Directions request failed due to ' + status);
          }
        }
      );
    }
  }, [currentLocation, destination]);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry || !place.geometry.location) return;
    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    setDestination(location);
    mapRef.current.panTo(location);
    setSelectedSpot(null);
  };

  if (!isLoaded || !currentLocation) return <p>Loading Map...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Autocomplete
          onLoad={(ref) => (autocompleteRef.current = ref)}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            placeholder="Search a place"
            className="border px-4 py-2 rounded w-[300px] shadow"
          />
        </Autocomplete>
      </div>

      <div className="flex justify-center mb-2">
        <button
          onClick={toggleLiveTracking}
          className={`px-4 py-2 rounded text-white ${
            liveTracking ? 'bg-red-600' : 'bg-green-600'
          }`}
        >
          {liveTracking ? 'Stop Live Tracking' : 'Start Live Tracking'}
        </button>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation}
        zoom={14}
        onClick={handleMapClick}
        onLoad={(map) => (mapRef.current = map)}
      >
        <Marker position={currentLocation} label="You" />
        {destination && <Marker position={destination} label="Dest" />}

        {parkingSpots.map((spot) => (
          <Marker
            key={spot.id}
            position={{ lat: spot.latitude, lng: spot.longitude }}
            label="P"
            onClick={() => {
              setDestination({ lat: spot.latitude, lng: spot.longitude });
              setSelectedSpot(spot);
            }}
          />
        ))}

        {selectedSpot && (
          <InfoWindow
            position={{
              lat: selectedSpot.latitude,
              lng: selectedSpot.longitude,
            }}
            onCloseClick={() => setSelectedSpot(null)}
          >
            <div className="text-sm">
              <h2 className="font-bold text-base">{selectedSpot.name}</h2>
              <p>{selectedSpot.address}</p>
              <p>Price: ₹{selectedSpot.pricePerHour}/hour</p>
              <p>
                Availability:{' '}
                <span className={selectedSpot.available ? 'text-green-600' : 'text-red-600'}>
                  {selectedSpot.available ? 'Available' : 'Full'}
                </span>
              </p>
            </div>
          </InfoWindow>
        )}

        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {duration && (
        <div className="text-center text-lg font-semibold">
          Estimated Travel Time: {duration}
        </div>
      )}

      {nearestSpots.length > 0 && (
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Nearest Parking Spots</h3>
          <ul className="space-y-1">
            {nearestSpots.map((spot) => (
              <li key={spot.id} className="text-gray-800">
                🚗 <strong>{spot.name}</strong> – {spot.distance.toFixed(2)} km – ₹{spot.pricePerHour}/hr
                <button
                  className="ml-2 text-blue-600 underline"
                  onClick={() =>
                    setDestination({ lat: spot.latitude, lng: spot.longitude })
                  }
                >
                  Navigate
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MapView;
