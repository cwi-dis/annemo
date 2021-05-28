import * as React from "react";
import { Route, HashRouter as Router, Switch } from "react-router-dom";

import Sidebar from "./sidebar";
import Social from "./social";
import Video from "./video";

interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <Router>
      <div style={{ display: "flex" }}>
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
            </Switch>
          </Route>
          <Route path="/">
            <p>Page not found</p>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
