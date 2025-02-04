import { TitleDisplayContainer } from "../components/style/General";
import { HomeDisplay } from "../components/style/Home.styles";
import { Tittle } from "../components/style/Text";
import { SubmitButton } from "../components/style/UploadDocuments.style";

const SendScheduleEmail = () => {
  return (
    <TitleDisplayContainer>
      <Tittle>Envio de cronogramas</Tittle>
      <HomeDisplay>
        <div>
          {" "}
          <SubmitButton>Crear cronograma</SubmitButton>{" "}
          <SubmitButton>Enviar cronograma al correo</SubmitButton>
        </div>
      </HomeDisplay>
    </TitleDisplayContainer>
  );
};
export default SendScheduleEmail;
