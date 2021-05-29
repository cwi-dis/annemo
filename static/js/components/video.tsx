import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import throttle from "lodash.throttle";

import { RouterParams } from "./app";

interface VideoProps {
}

const Video: React.FC<VideoProps> = (props) => {
  const { video, dimension, subject } = useParams<RouterParams>();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [ location, setLocation ] = useState<string>();
  const [ sliderValue, setSliderValue ] = useState<number>(0);

  useEffect(() => {
    fetch("/location").then((res) => {
      return res.json();
    }).then((data) => {
      setLocation(data.location);
    });
  }, []);

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
  }

  const onSliderChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const videoElement = videoRef.current;
      saveData(e.target.valueAsNumber, videoElement.currentTime, !videoElement.paused);
    }

    setSliderValue(e.target.valueAsNumber);
  };

  return (
    <div style={{ width: "75%" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {(location) && (
          <div style={{ maxWidth: 800 }}>
            <video
              src={`${location}/${video}`}
              width="800"
              height="600"
              preload="auto"
              ref={videoRef}
              onEnded={() => {
                if (videoRef.current)
                  saveData(
                    sliderValue,
                    videoRef.current.currentTime,
                    false
                  )
              }}
              controls
            />

            <h5 className="title is-5 has-text-centered mt-4">
              {dimension}
            </h5>

            <input
              type="range"
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
