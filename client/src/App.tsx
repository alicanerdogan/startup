import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Hello } from "components/Hello";
import { Register } from "components/Register";

const App: React.FC<{}> = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact children={() => <Register />} />
        <Route
          path="/hello"
          exact
          children={() => <Hello compiler="TypeScript" framework="React" />}
        />
      </Switch>
    </Router>
  );
};

export default App;
