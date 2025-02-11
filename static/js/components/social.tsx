import * as React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { capitalize, Dimensions } from "../util";
import { RouterParams } from "./app";

/**
 * Renders sliders for each social dimension associated to a video
 */
const Social: React.FC = () => {
  const { subject, video } = useParams<RouterParams>();

  const [ isSaved, setIsSaved ] = useState(false);
  // Initialise each dimension to zero
  const [ dimensions, setDimensions ] = useState<Dimensions>({
    agreement: 0,
    engagement: 0,
    dominance: 0,
    performance: 0,
    rapport: 0
  });

  // Function to update a given dimension to a specific value
  const updateDimension = (dimension: keyof Dimensions, value: number) => {
    setDimensions({
      ...dimensions,
      [dimension]: value
    });
  };

  // Saves the data on the server by means of a POST request
  const saveData = async () => {
    try {
      await fetch("/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: dimensions,
          subject, video,
        })
      });

      setIsSaved(true);
    } catch {
      prompt("Could not save data");
    }
  };

  return (
    <div className="column is-9">
      <h4 className="title is-4">Social Dimension Annotation</h4>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 800 }}>
          {(!isSaved) ? (
            <>
              {Object.entries(dimensions).map(([dimension, value]: [keyof Dimensions, number]) => {
                // Generate a slider for each dimension
                return (
                  <div key={dimension} style={{ width: "100%" }}>
                    <h5 className="title is-5 has-text-centered mt-4">
                      {capitalize(dimension)}
                    </h5>

                    <input
                      type="range"
                      value={value}
                      onChange={(e) => updateDimension(dimension, e.target.valueAsNumber)}
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

              <div className="columns is-centered" style={{ marginTop: 30 }}>
                <div className="column is-3">
                  <button className="button is-info is-fullwidth" onClick={saveData}>
                    Save
                  </button>
                </div>
              </div>
            </>
          ) : (
            <h5 className="title is-5 has-text-centered mt-4">
              Thanks! Please proceed to the next video.
            </h5>
          )}

        </div>
      </div>
    </div>
  );
};

export default Social;
