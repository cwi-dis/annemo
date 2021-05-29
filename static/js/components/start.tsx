import * as React from "react";

interface StartProps {
}

const Start: React.FC<StartProps> = (props) => {
  return (
    <div style={{ width: "75%" }}>
      <h5 className="title is-5 mt-4" style={{ textAlign: "center"}}>
        Select a video on the left to get started
      </h5>
    </div>
  );
};

export default Start;
