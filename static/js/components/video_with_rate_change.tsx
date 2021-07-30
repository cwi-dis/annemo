import * as React from "react";
import { useEffect, useRef } from "react";
import omit from "lodash.omit";

type VideoProps = JSX.IntrinsicElements["video"];

interface VideoWithRateChangeProps extends VideoProps {
  playbackRate: number;
}

const VideoWithRateChange: React.ForwardRefRenderFunction<HTMLVideoElement, VideoWithRateChangeProps> = (props, ref) => {
  const { playbackRate } = props;
  const innerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ref) {
      if (typeof ref == "object") {
        ref.current = innerRef.current;
      } else {
        ref(innerRef.current);
      }
    }
  }, []);

  useEffect(() => {
    if (innerRef.current) {
      innerRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  return (
    <video ref={innerRef} {...omit(props, ["playbackRate"])} />
  );
};

export default React.forwardRef(VideoWithRateChange);
