import SignIn from "./SignIn"
import './App.css';
import Display from "./Display";
import { BrowserRouter as Router, Switch,Route,Link} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
        <div>
          <Link to="/login">Login</Link>
          <Link to="/home">Home</Link>
        </div>
        
        <Switch>
          <Route path="/login">
            <SignIn/>
          </Route>

          <Route path="/home">
            <Display/>
          </Route>
          <Route path="/21">
            <h1>Hello brother</h1>
          </Route>
        </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
