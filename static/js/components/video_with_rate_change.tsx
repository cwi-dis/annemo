import * as React from "react";
import { useEffect } from "react";
import omit from "lodash.omit";

type VideoProps = JSX.IntrinsicElements["video"];

interface VideoWithRateChangeProps extends VideoProps {
  playbackRate: number;
}

const VideoWithRateChange: React.ForwardRefRenderFunction<HTMLVideoElement, VideoWithRateChangeProps> = (props, ref) => {
  const { playbackRate } = props;

  useEffect(() => {
    if (typeof ref === "object" && ref?.current) {
      ref.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  return (
    <video ref={ref} {...omit(props, ["playbackRate"])} />
  );
};

export default React.forwardRef(VideoWithRateChange);
