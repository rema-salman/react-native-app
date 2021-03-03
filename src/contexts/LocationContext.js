import React, { useContext, useState } from "react";

const LocationContext = React.createContext();

export const useLocation = () => {
  return useContext(LocationContext);
};

export const LocationProvider = ({ children }) => {
  const [currentUserLocation, setCurrentUserLocation] = useState({});

  function setUserCurrentLocation(coordinates) {
    setCurrentUserLocation(coordinates);
    console.log("FROM CONTEXT ......" + currentUserLocation);
  }

  // passing(exporting) these to other components
  const value = {
    currentUserLocation,
    setUserCurrentLocation,
  };

  // Making sure we set location then load
  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
