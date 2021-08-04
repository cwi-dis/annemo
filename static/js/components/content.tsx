import * as React from "react";
import { Route, Switch } from "react-router-dom";

import Social from "./social";
import Start from "./start";
import Video from "./video";

/**
 * Renders the application's main content, which can either be a video, the
 * social dimension annotation component or a start page if routing params are
 * given.
 */
const Content: React.FC = () => {
  return (
    <Switch>
      <Route path="/user/:subject/video/:video/:dimension">
        <Video />
      </Route>
      <Route path="/user/:subject/social/:video">
        <Social />
      </Route>
      <Route path="/">
        <Start />
      </Route>
    </Switch>
  );
};

export default Content;
