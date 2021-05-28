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
        <Sidebar />
        <Switch>
          <Route path="/video/:subject/:video/:dimension">
            <Video />
          </Route>
          <Route path="/social/:subject/:video">
            <Social />
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
