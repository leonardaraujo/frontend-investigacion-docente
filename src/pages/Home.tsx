import { TitleDisplayContainer } from "../components/style/General";
import { HomeDisplay } from "../components/style/Home.styles";
import { Tittle } from "../components/style/Text";

const Home = () => {
  return (
    <TitleDisplayContainer>
      <Tittle>PROCEDIMIENTO DE GESTIÓN DE INVESTIGACIÓN DOCENTE</Tittle>
      <HomeDisplay>
        <p>Index del prototipo para el desarrollo de la gestion docente para investigadores</p>
      </HomeDisplay>
    </TitleDisplayContainer>
  );
};
export default Home;
