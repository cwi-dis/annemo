import * as React from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import classNames from "classnames";

import { capitalize } from "../util";
import { RouterParams } from "./app";
import useVideoList from "../hooks/use_video_list";

/**
 * Renders the application's sidebar, which contains links to all the videos
 * retrieved from the server.
 */
const Sidebar: React.FC = () => {
  const location = useLocation();
  const { subject } = useParams<RouterParams>();
  const videos = useVideoList(subject);

  return (
    <div className="column is-3">
      <h4 className="title is-4">Videos</h4>

      <div className="sidebar-elements">
        {videos.map((v, i) => {
          return (
            <div key={`segment.${i}`} className="segment">
              <ul>
                {["arousal", "valence"].map((dim, j) => {
                  // Return a link for both, arousal and valence for each video
                  return (
                    <li key={`${i}.${j}`}>
                      <Link
                        to={`/user/${subject}/video/${v}/${dim}`}
                        className={classNames({ "is-bold": location.pathname == `/user/${subject}/video/${v}/${dim}`})}
                      >
                        {capitalize(dim)} - {v}
                      </Link>
                    </li>
                  );
                }).concat(
                  <li key={`social.${i}`}>
                    <Link
                      to={`/user/${subject}/social/${v}`}
                      className={classNames({ "is-bold": location.pathname == `/user/${subject}/social/${v}`})}
                    >
                      Social dimension annotation
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
