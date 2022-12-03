

import Header from "./components/header";
import Jumbotron from "./components/jumbotron";
import Main from "./components/main" 


function App() {
  return (
    <div>
      <Header />
      <div style={{ display: "flex"  }}>
        <Main />
      </div>
 
    </div>
  );
}

export default App;
