import { useState } from "react";
import logo from "./logo.svg";
import "./styles.css";
import Home from "./components/home.component";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;
