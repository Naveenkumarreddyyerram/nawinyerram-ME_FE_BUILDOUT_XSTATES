import React, { useEffect, useState } from "react";
import "./App.css"; // Make sure to import your stylesheet

const API_BASE = "https://location-selector.labs.crio.do";

function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Fetch all initial countries
  useEffect(() => {
    fetch(`${API_BASE}/countries`)
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch((error) => console.error("Failed to fetch countries:", error));
  }, []);

  // Handle Country Selection
  const handleCountryChange = async (event) => {
    const country = event.target.value;
    setSelectedCountry(country);
    setSelectedState("");
    setSelectedCity("");
    setCities([]);

    if (!country) {
      setStates([]);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/country=${encodeURIComponent(country)}/states`
      );
      const data = await response.json();
      setStates(data);
    } catch (error) {
      console.error("Failed to fetch states:", error);
      setStates([]);
    }
  };

  // Handle State Selection
  const handleStateChange = async (event) => {
    const state = event.target.value;
    setSelectedState(state);
    setSelectedCity("");
    setCities([]);

    if (!state || !selectedCountry) return;

    try {
      const response = await fetch(
        `${API_BASE}/country=${encodeURIComponent(selectedCountry)}/state=${encodeURIComponent(state)}/cities`
      );
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      setCities([]);
    }
  };

  // Handle City Selection
  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  return (
    <div className="app-container">
      <div className="location-card">
        <h1 className="title">Select Location</h1>
        
        <div className="dropdown-grid">
          <select 
            value={selectedCountry} 
            onChange={handleCountryChange}
            className="styled-select"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>

          <select 
            value={selectedState} 
            onChange={handleStateChange} 
            disabled={!selectedCountry}
            className="styled-select"
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>

          <select 
            value={selectedCity} 
            onChange={handleCityChange} 
            disabled={!selectedState}
            className="styled-select"
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {selectedCity && (
          <div className="result-banner">
            <p>
              You selected <span className="highlight">{selectedCity}</span>,{" "}
              {selectedState}, {selectedCountry}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
