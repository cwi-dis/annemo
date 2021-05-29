import * as React from "react";

interface StartProps {
}

const Start: React.FC<StartProps> = (props) => {
  return (
    <div className="column is-9">
      <h5 className="title is-5 has-text-centered mt-4">
        Select a video on the left to get started
      </h5>
    </div>
  );
};

export default Start;
