import { useState, useEffect } from "react";

/**
 * Fetches the list of videos from the server as a state variable. Initially,
 * the value returned is the empty list, but will return a list populated with
 * links to the videos videos once the value is fetched from the server.
 *
 * @returns List of videos
 */
function useVideoList(subject: string) {
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

  return videos;
}

export default useVideoList;
