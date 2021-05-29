import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import classNames from "classnames";

import { RouterParams } from "./app";

/**
 * Capitalises a word by converting its first letter to uppercase.
 *
 * @param word Word to be capitalised
 * @returns The input word with the first letter capitalised
 */
function capitalize(word: string) {
  const firstLetter = word.slice(0, 1);
  const rest = word.slice(1);

  return firstLetter.toUpperCase() + rest;
}

interface SidebarProps {
}

/**
 * Renders the application's sidebar, which contains links to all the videos
 * retrieved from the server.
 */
const Sidebar: React.FC<SidebarProps> = (props) => {
  const location = useLocation();
  const { subject } = useParams<RouterParams>();

  const [ videos, setVideos ] = useState<Array<string>>([]);

  useEffect(() => {
    // Fetch list of videos from the server, passing subject name along with
    // the request. If the subject name is not valid, an empty list is returned.
    fetch(`/videos?subject=${subject}`).then((res) => {
      return res.json();
    }).then((data) => {
      setVideos(data.videos);
    });
  }, []);

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
