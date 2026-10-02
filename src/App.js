import React, { useEffect, useState } from "react";

const API_BASE = "https://location-selector.labs.crio.do";

function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/countries`)
      .then((response) => response.json())
      .then((data) => {
        setCountries(data);
      })
      .catch((error) => {
        console.error("Failed to fetch countries:", error);
      });
  }, []);

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

  const handleStateChange = async (event) => {
    const state = event.target.value;

    setSelectedState(state);
    setSelectedCity("");
    setCities([]);

    if (!state || !selectedCountry) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/country=${encodeURIComponent(
          selectedCountry
        )}/state=${encodeURIComponent(state)}/cities`
      );

      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      setCities([]);
    }
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  return (
    <div className="app">
      <div className="location-selector">
        <h1>Location Selector</h1>

        <select
          value={selectedCountry}
          onChange={handleCountryChange}
        >
          <option value="">Select Country</option>

          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          value={selectedState}
          onChange={handleStateChange}
          disabled={!selectedCountry}
        >
          <option value="">Select State</option>

          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <select
          value={selectedCity}
          onChange={handleCityChange}
          disabled={!selectedState}
        >
          <option value="">Select City</option>

          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        {selectedCity && (
          <p>
            You selected {selectedCity}, {selectedState},{" "}
            {selectedCountry}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
