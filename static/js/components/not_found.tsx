import * as React from "react";

interface NotFoundProps {
}

/**
 * Renders a "Not found" message occupying the full screen.
 */
const NotFound: React.FC<NotFoundProps> = (props) => {
  return (
    <div className="column is-13">
      <h3 className="title is-3 has-text-centered mt-4">
        Page not found
      </h3>
    </div>
  );
};

export default NotFound;
