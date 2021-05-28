import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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

  const onSliderChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const videoElement = videoRef.current;

      const data = {
        clienttime: Date.now(),
        subject,
        video,
        dimension,
        time: videoElement.currentTime,
        value: e.target.valueAsNumber,
        playing: !videoElement.paused,
      };

      fetch("/emotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject, data
        })
      });
    }

    setSliderValue(e.target.valueAsNumber);
  };

  return (
    <div style={{ width: "75%" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {(location) && (
          <div>
            <video
              src={`${location}/${video}`}
              width="800"
              height="600"
              preload="auto"
              ref={videoRef}
              controls
            />

            <h5 className="title is-5 mt-4" style={{ textAlign: "center" }}>
              {dimension}
            </h5>

            <input
              type="range"
              value={sliderValue}
              min={-1}
              max={1}
              step={0.01}
              style={{ width: 800 }}
              onChange={onSliderChanged}
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
