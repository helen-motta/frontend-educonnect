import { useAuth } from './AuthContext';
import Inicio from './Inicio';
import InicioProfessor from './InicioProfessor';
import InicioAdm from './InicioAdm';
import InicioCoordenador from './InicioCoordenador';

const PROFILE_HOME_COMPONENT = {
  1: InicioAdm,
  2: InicioCoordenador,
  3: InicioProfessor,
};

export default function InicioRouter() {
  const { user } = useAuth();
  const idPerfil = user?.usuario?.idPerfil;
  const HomeComponent = PROFILE_HOME_COMPONENT[idPerfil] || Inicio;

  return <HomeComponent />;
}
