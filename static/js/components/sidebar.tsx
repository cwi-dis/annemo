import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import classNames from "classnames";

import { RouterParams } from "./app";

function capitalize(word: string) {
  const firstLetter = word.slice(0, 1);
  const rest = word.slice(1);

  return firstLetter.toUpperCase() + rest;
}

interface SidebarProps {
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const location = useLocation();
  const { subject } = useParams<RouterParams>();

  const [ videos, setVideos ] = useState<Array<string>>([]);

  useEffect(() => {
    fetch("/videos").then((res) => {
      return res.json();
    }).then((data) => {
      setVideos(data.videos);
    });
  }, []);

  return (
    <div style={{ width: "25%" }}>
      <h4 className="title is-4">Videos</h4>

      <ul>
        {videos.map((v, i) => {
          const videoLinks = ["arousal", "valence"].map((dim, j) => {
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
          });

          return videoLinks.concat(
            <li key={`social.${i}`}>
              <Link
                to={`/user/${subject}/social/${v}`}
                className={classNames({ "is-bold": location.pathname == `/user/${subject}/social/${v}`})}
              >
                Social dimension annotation
              </Link>
            </li>
          ).concat(
            <li key={`divider.${i}`}>
              <hr/>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
