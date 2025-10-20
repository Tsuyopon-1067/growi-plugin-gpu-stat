import React from "react";

import ReactDOM from "react-dom/client";
import { GpuStatView } from "./components/GpuStatView";

const str = `
function MersenneTwister(seed) {
  if (arguments.length == 0) {
    seed = new Date().getTime();
  }

  this._mt = new Array(624);
  this.setSeed(seed);
}
`;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GpuStatView />
  </React.StrictMode>
);
