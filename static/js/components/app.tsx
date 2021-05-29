import * as React from "react";
import { Route, HashRouter as Router, Switch } from "react-router-dom";

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
            <div className="column is-12">
              <h3 className="title is-3 has-text-centered mt-4">
                Page not found
              </h3>
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
