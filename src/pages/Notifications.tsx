import { TitleDisplayContainer } from "../components/style/General";
import { HomeDisplay, HomeDisplayInner } from "../components/style/Home.styles";
import { Tittle } from "../components/style/Text";

const notificaciones = [
  "Documento I-001 recibido - 2025-01-20 08:30",
  "Documento I-002 observado - 2025-01-20 09:00",
  "Documento I-003 recibido - 2025-01-21 10:45",
  "Documento I-004 observado - 2025-01-21 12:30",
  "Documento I-005 recibido - 2025-01-22 14:00",
  "Documento I-006 observado - 2025-01-22 16:30",
];
const Notifications = () => {
  return (
    <TitleDisplayContainer>
      <Tittle>Notificaciones</Tittle>
      <HomeDisplay>
        <HomeDisplayInner>
          {" "}
          {notificaciones.map((notificacion, index) => (
            <li key={index}>{notificacion}</li>
          ))}
        </HomeDisplayInner>
      </HomeDisplay>
    </TitleDisplayContainer>
  );
};
export default Notifications;
