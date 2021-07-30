import * as React from "react";
import { useEffect } from "react";
import omit from "lodash.omit";

import useForwardedRef from "../hooks/use_forwarded_ref";

type VideoProps = JSX.IntrinsicElements["video"];

interface VideoWithRateChangeProps extends VideoProps {
  playbackRate: number;
}

const VideoWithRateChange: React.ForwardRefRenderFunction<HTMLVideoElement, VideoWithRateChangeProps> = (props, ref) => {
  const { playbackRate } = props;
  const innerRef = useForwardedRef(ref);

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
