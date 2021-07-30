import * as React from "react";
import { useEffect } from "react";
import omit from "lodash.omit";

import useForwardedRef from "../hooks/use_forwarded_ref";

// Type defining props of HTMLVideoElement
type VideoProps = JSX.IntrinsicElements["video"];

/**
 * Prop definition for `VideoWithRateChange` component extending props of
 * `HTMLVideoElement` by adding a `playbackRate` prop.
 */
interface VideoWithRateChangeProps extends VideoProps {
  playbackRate: number;
}

/**
 * Component which renders a `HTMLVideoElement` which also supports setting
 * the video playback rate as a prop. All props passed to this component will
 * be passed on to the contained `video` element. Furthermore, the `ref` prop
 * will also be forwarded to that element.
 */
const VideoWithRateChange: React.ForwardRefRenderFunction<HTMLVideoElement, VideoWithRateChangeProps> = (props, ref) => {
  // Get playback rate prop
  const { playbackRate } = props;
  // Get ref that can be used in this component from forwarded ref object
  const innerRef = useForwardedRef(ref);

  // Update property `playbackRate` on video element every time the passed
  // `playbackRate` prop changes
  useEffect(() => {
    if (innerRef.current) {
      // Update playback rate on ref to video element
      innerRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Render video element, forwarding the ref and passing down all props except
  // for `playbackRate` which does not exist on the video element
  return (
    <video ref={innerRef} {...omit(props, ["playbackRate"])} />
  );
};

// Export component with forwarded ref
export default React.forwardRef(VideoWithRateChange);
