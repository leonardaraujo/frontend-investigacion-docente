import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TitleDisplayContainer } from "../components/style/General";
import { Tittle } from "../components/style/Text";
import { HomeDisplay } from "../components/style/Home.styles";
import {
  ErrorMessage,
  FormContainer,
  FormField,
  Input,
  Label,
  RadioGroup,
  RadioInput,
  RadioLabel,
  SubmitButton,
  SubmitFile,
} from "../components/style/UploadDocuments.style";

const schema = yup.object().shape({
  fullName: yup.string().required("Nombres y apellidos son requeridos"),
  teacherCode: yup.string().required("Código de docente es requerido"),
  reportType: yup.string().required("Debe seleccionar un tipo de informe"),
});

const UploadDocuments = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <TitleDisplayContainer>
      <Tittle>Subir avance de informe e informe final</Tittle>
      <HomeDisplay>
        <FormContainer>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField>
              <Label>Nombres y Apellidos</Label>
              <Input {...register("fullName")} />
              {errors.fullName && (
                <ErrorMessage>{errors.fullName.message}</ErrorMessage>
              )}
            </FormField>
            <FormField>
              <Label>Código de Docente</Label>
              <Input {...register("teacherCode")} />
              {errors.teacherCode && (
                <ErrorMessage>{errors.teacherCode.message}</ErrorMessage>
              )}
            </FormField>
            <RadioGroup>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  value="avance"
                  {...register("reportType")}
                />
                Avance de Informe
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  value="final"
                  {...register("reportType")}
                />
                Informe Final
              </RadioLabel>
            </RadioGroup>
            {errors.reportType && (
              <ErrorMessage>{errors.reportType.message}</ErrorMessage>
            )}
            <div>
              <SubmitFile>Subir archivo</SubmitFile>
              <label htmlFor=""> archivo.pdf</label>
            </div>
            <div>
              <SubmitButton type="submit">Subir Documento</SubmitButton>
            </div>
          </form>
        </FormContainer>
      </HomeDisplay>
    </TitleDisplayContainer>
  );
};

export default UploadDocuments;
