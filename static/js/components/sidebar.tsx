import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { RouterParams } from "./app";

function capitalize(word: string) {
  const firstLetter = word.slice(0, 1);
  const rest = word.slice(1);

  return firstLetter.toUpperCase() + rest;
}

interface SidebarProps {
}

const Sidebar: React.FC<SidebarProps> = (props) => {
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
        {videos.map((v) => {
          const videoLinks = ["arousal", "valence"].map((dim) => {
            return (
              <li>
                <Link to={`/user/${subject}/video/${v}/${dim}`}>
                  {capitalize(dim)} - {v}
                </Link>
              </li>
            );
          });

          return videoLinks.concat(
            <li>
              <Link to={`/user/${subject}/social/${v}`}>
                Social dimension annotation
              </Link>
            </li>
          ).concat(
            <li>
              <hr/>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
