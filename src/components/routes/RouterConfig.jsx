import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../pages/Home";       // ✅ Con mayúscula
import Products from "../pages/Products"; // ✅ Con mayúscula
import Contact from "../pages/Contact";   // ✅ Con mayúscula
import About from "../pages/About";       // ✅ Con mayúscula

const RouterConfig = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/productos" component={Products} />
      <Route path="/contacto" component={Contact} />
      <Route path="/nosotros" component={About} />
    </Switch>
  </Router>
);

export default RouterConfig;