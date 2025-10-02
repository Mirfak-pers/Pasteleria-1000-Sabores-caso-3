import { useLocation} from "react-router-dom";

function useQuery() {return new URLSearchParams(useLocation().search)};
const PerfilCliente = () => {
    const q = useQuery();
    return <h2>Perfil CLiente - Bienvenido { q.get("nombre")}</h2>
};
export default PerfilCliente;