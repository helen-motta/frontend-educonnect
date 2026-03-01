import { useAuth } from './AuthContext';
import Inicio from './Inicio';
import InicioProfessor from './InicioProfessor';
import InicioAdm from './InicioAdm';
import InicioCoordenador from './InicioCoordenador';

export default function InicioRouter() {
  const { user } = useAuth();
  const idPerfil = user?.usuario?.idPerfil;

  switch (idPerfil) {
    case 1:
      return <InicioAdm />;
    case 2:
      return <InicioCoordenador />;
    case 3:
      return <InicioProfessor />;
    default:
      return <Inicio />;
  }
}
