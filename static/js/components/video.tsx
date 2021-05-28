import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RouterParams } from "./app";

interface VideoProps {
}

const Video: React.FC<VideoProps> = (props) => {
  const { video, dimension } = useParams<RouterParams>();
  const [ location, setLocation ] = useState<string>();

  useEffect(() => {
    fetch("/location").then((res) => {
      return res.json();
    }).then((data) => {
      setLocation(data.location);
    });
  }, []);

  return (
    <div style={{ width: "75%" }}>
      <h4 className="title is-4">Video {dimension}</h4>

      <div style={{ display: "flex", justifyContent: "center" }}>
        {(location) && (
          <video
            src={`${location}/${video}`}
            width="800"
            height="600"
            preload="auto"
            controls
          />
        )}
      </div>
    </div>
  );
};

export default Video;
