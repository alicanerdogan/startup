import * as React from "react";
import * as ReactDOM from "react-dom";

import "./styles/index.css";

const App = React.lazy(() => import(/* webpackChunkName: 'App' */ "./App"));

ReactDOM.render(
  <React.Suspense fallback={null}>
    <App />
  </React.Suspense>,
  document.getElementById("root")
);
