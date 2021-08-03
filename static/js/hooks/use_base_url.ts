import { useState, useEffect } from "react";

/**
 * Fetches the base URL for the videos as a state variable. Initially, the
 * value returned is undefined, but will return the URL as a string once the
 * value is fetched from the server.
 *
 * @returns Base URL or undefined
 */
function useBaseUrl() {
  // Initialise location value as a state variable
  const [ location, setLocation ] = useState<string>();

  // Fetch URL as side effect on component mount
  useEffect(() => {
    // Fetches the base URL for the video file and update state variable
    fetch("/location").then((res) => {
      return res.json();
    }).then((data) => {
      setLocation(data.location);
    });
  }, []);

  return location;
}

export default useBaseUrl;
