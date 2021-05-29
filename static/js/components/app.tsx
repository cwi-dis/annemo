import * as React from "react";
import { Route, HashRouter as Router, Switch } from "react-router-dom";
import NotFound from "./not_found";

import Sidebar from "./sidebar";
import Social from "./social";
import Start from "./start";
import Video from "./video";

export interface RouterParams {
  subject: string;
  video: string;
  dimension: string;
}

interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <Router>
      <div className="columns">
        <Switch>
          <Route path="/user/:subject">
            <Sidebar />
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
          </Route>
          <Route path="/">
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
