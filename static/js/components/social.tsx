import * as React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { RouterParams } from "./app";

interface Dimensions {
  Agreement: number;
  Engagement: number;
  Dominance: number;
  Performance: number;
  Rapport: number;
}

interface SocialProps {
}

const Social: React.FC<SocialProps> = (props) => {
  const { subject } = useParams<RouterParams>();

  const [ isSaved, setIsSaved ] = useState(false);
  const [ dimensions, setDimensions ] = useState<Dimensions>({
    "Agreement": 0,
    "Engagement": 0,
    "Dominance": 0,
    "Performance": 0,
    "Rapport": 0
  });

  const updateDimension = (dimension: keyof Dimensions, value: number) => {
    setDimensions({
      ...dimensions,
      [dimension]: value
    });
  };

  const saveData = async () => {
    try {
      await fetch("/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: dimensions,
          subject
        })
      });

      setIsSaved(true);
    } catch {
      prompt("Could not save data");
    }
  };

  return (
    <div style={{ width: "75%" }}>
      <h4 className="title is-4">Social Dimension Annotation</h4>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 800 }}>
          {(!isSaved) ? (
            <>
              {Object.entries(dimensions).map(([dimension, value]) => {
                return (
                  <div key={dimension} style={{ width: "100%" }}>
                    <h5 className="title is-5 mt-4" style={{ textAlign: "center" }}>
                      {dimension}
                    </h5>

                    <input
                      type="range"
                      value={value}
                      onChange={(e) => updateDimension(dimension as keyof Dimensions, e.target.valueAsNumber)}
                      min={-1}
                      max={1}
                      step={0.33}
                      style={{ width: "100%" }}
                    />

                    <div style={{ display: "flex", justifyContent: "space-between"}}>
                      <p>very low</p>
                      <p>very high</p>
                    </div>
                  </div>
                );
              })}

              <button className="button is-info mt-4" onClick={saveData}>
                Save
              </button>
            </>
          ) : (
            <h5 className="title is-5 mt-4" style={{ textAlign: "center"}}>
              Thanks! Please proceed to the next video.
            </h5>
          )}

        </div>
      </div>
    </div>
  );
};

export default Social;
