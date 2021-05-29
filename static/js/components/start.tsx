import * as React from "react";

interface StartProps {
}

/**
 * Component which is rendered at the very beginning, prompting the user to
 * select a video in the sidebar.
 */
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
