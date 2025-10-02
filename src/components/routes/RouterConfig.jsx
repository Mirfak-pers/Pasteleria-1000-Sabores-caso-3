import { BrowserRouter as Router, Route , Switch } from "react-router-dom";
import Home from "../../components/pages/home";
import PerfilAdmin from "../pages/perfilAdmin";
import PerfilCliete from "../pages/perfilCliente";

const RouterConfig = () => (
    <Router>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/perfil-cliete" component={perfilCliente} />
            <Route path="/perfil-admin" component={perfilAdmin} />
        </Switch>
    </Router>
);

export default RouterConfig;