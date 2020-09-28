import * as React from 'react';
import { Fragment } from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';

import { listLogEntries } from './API';
import LogEntryForm from './LogEntryForm';

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 37.6,
    longitude: -95.665,
    zoom: 3,
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  useEffect(() => {
    getEntries();
  }, []);

  const showAddMarkerPopup = (e) => {
    const [longitude, latitude] = e.lngLat;
    setAddEntryLocation({
      latitude,
      longitude,
    });
  };

  return (
    <ReactMapGL
      {...viewport}
      mapStyle='mapbox://styles/em0/ckfhemx4c0cqd19rrorc2ojjx'
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      onDblClick={showAddMarkerPopup}
    >
      {logEntries.map((entry) => (
        <Fragment key={entry._id}>
          <Marker
            key={entry._id}
            latitude={entry.latitude}
            longitude={entry.longitude}
            offsetLeft={-12}
            offsetTop={-24}
          >
            <svg
              className='marker'
              style={{
                width: `${6 * viewport.zoom}px`,
                height: `${6 * viewport.zoom}px`,
              }}
              viewBox='0 0 24 24'
              fill='none'
              onClick={() =>
                setShowPopup({
                  ...setShowPopup,
                  [entry._id]: true,
                })
              }
            >
              <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path>
              <circle cx='12' cy='10' r='3'></circle>
            </svg>
          </Marker>
          {showPopup[entry._id] ? (
            <Popup
              latitude={entry.latitude}
              longitude={entry.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => setShowPopup({})}
              anchor='top'
            >
              <div className='popup'>
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
                <p>{entry.comments}</p>
                {entry.image && <img src={entry.image} alt={entry.title} />}
                <small>
                  Visted on: {new Date(entry.visitDate).toLocaleDateString()}
                </small>
              </div>
            </Popup>
          ) : null}
        </Fragment>
      ))}
      {addEntryLocation ? (
        <Fragment>
          <Marker
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            offsetLeft={-12}
            offsetTop={-24}
          >
            <svg
              className='marker-add'
              style={{
                width: `${6 * viewport.zoom}px`,
                height: `${6 * viewport.zoom}px`,
              }}
              viewBox='0 0 24 24'
              fill='none'
            >
              <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path>
              <circle cx='12' cy='10' r='3'></circle>
            </svg>
          </Marker>
          <Popup
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            closeButton={true}
            closeOnClick={false}
            dynamicPosition={true}
            onClose={() => setAddEntryLocation(null)}
            anchor='top'
          >
            <div className='popup'>
              <LogEntryForm
                onClose={() => {
                  setAddEntryLocation(null);
                  getEntries();
                }}
                location={addEntryLocation}
              />
            </div>
          </Popup>
        </Fragment>
      ) : null}
    </ReactMapGL>
  );
};

export default App;
