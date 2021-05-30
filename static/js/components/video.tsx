import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import throttle from "lodash.throttle";

import { RouterParams } from "./app";

/**
 * Renders a video element alongside a slider for annotating either arousal or
 * valence. The slider values are submitted to the server via POST request on
 * change. A throttling function makes sure a value is submitted at most every
 * 100ms to avoid chocking the server.
 */
const Video: React.FC = () => {
  // Get video name, subject name and dimension from routing params
  const { video, dimension, subject } = useParams<RouterParams>();
  // Ref for interacting with the video element
  const videoRef = useRef<HTMLVideoElement>(null);

  const [ location, setLocation ] = useState<string>();
  const [ sliderValue, setSliderValue ] = useState<number>(0);

  useEffect(() => {
    // Fetches the base URL for the video file from the server
    fetch("/location").then((res) => {
      return res.json();
    }).then((data) => {
      setLocation(data.location);
    });
  }, []);

  useEffect(() => {
    // Reset slider value to zero if value of param dimension changes
    setSliderValue(0);
  }, [dimension]);

  // Save the data by submitting it to the server via POST request
  const saveData = (value: number, time: number, playing: boolean) => {
    const data = {
      clienttime: Date.now(),
      subject, video, dimension, time, value, playing
    };

    fetch("/emotion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject, data
      })
    });
  };

  // Callback which is invoked when the slider value changes
  const onSliderChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const videoElement = videoRef.current;

      // Only send data to server if the video is playing
      if (!videoElement.paused) {
        saveData(
          e.target.valueAsNumber,
          videoElement.currentTime,
          !videoElement.paused
        );
      }
    }

    setSliderValue(e.target.valueAsNumber);
  };

  const onVideoEnded = () => {
    // Submit one more sample once the video finishes playing
    if (videoRef.current) {
      saveData(
        sliderValue,
        videoRef.current.currentTime,
        false
      );
    }
  };

  return (
    <div className="column is-9">
      <div style={{ display: "flex", justifyContent: "center" }}>
        {(location) && (
          <div style={{ maxWidth: 800 }}>
            <video
              src={`${location}/${video}`}
              width="800"
              height="600"
              preload="auto"
              ref={videoRef}
              onEnded={onVideoEnded}
              controls
            />

            <h5 className="title is-5 has-text-centered mt-4">
              {dimension}
            </h5>

            <input
              type="range"
              key={`${video}.${dimension}`}
              value={sliderValue}
              min={-1}
              max={1}
              step={0.01}
              style={{ width: "100%" }}
              onChange={throttle(onSliderChanged, 100)}
            />

            <div style={{ display: "flex", justifyContent: "space-between"}}>
              <p>{(dimension == "arousal") ? "very passive" : "very negative"}</p>
              <p>{(dimension == "arousal") ? "very active" : "very positive"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Video;
