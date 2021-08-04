import * as React from "react";
import { Route, HashRouter as Router, Switch } from "react-router-dom";

import Content from "./content";
import NotFound from "./not_found";
import Sidebar from "./sidebar";

/**
 * Elements which may be present in router params
 */
export interface RouterParams {
  subject: string;
  video: string;
  dimension: string;
}

/**
 * Central App component which contains the basic layout and routing
 * specification for the application.
 */
const App: React.FC = () => {
  return (
    <Router>
      <div className="columns">
        <Switch>
          <Route path="/user/:subject">
            <Sidebar />
            <Content />
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
