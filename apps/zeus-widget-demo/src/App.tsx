import { useState } from "react";

import { Chameleon, ZeusShadow } from "zeus-widget";

import reactLogo from "./assets/react.svg";

import viteLogo from "/vite.svg";
import "./App.css";

// import "zeus-widget/assets/style.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer noopener">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer noopener">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card ds">
        <div onClick={() => setCount((count) => count + 1)}>
          count is{" "}
          <button type="button" className="zeus:!bg-red-600">
            <ZeusShadow>
              <Chameleon>{count}</Chameleon>
            </ZeusShadow>
          </button>
        </div>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
