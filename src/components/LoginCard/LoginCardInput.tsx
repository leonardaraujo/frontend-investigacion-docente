// @ts-nocheck
import {
  LayoutInputs,
  LayoutLoginCardInput,
} from "../style/login/LoginCard.styles";
import { Text, Title } from "../style/general/Text.styles";
import { LayoutTextInput } from "../style/login/LoginCard.styles";
import IUserLogin from "../../interfaces/UserLogin.interface";
import { useForm } from "react-hook-form";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { StyledButton } from "../style/general/Button.styles";
import { yupResolver } from "@hookform/resolvers/yup";
import userSchema from "../../validations/userSchema";
import { useSessionStorage } from "usehooks-ts";
import { fLogin } from "../../fetch/fUser";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const LoginCardInput = () => {
  const navigate = useNavigate();
  const [stateLoginButton, setStateLoginButton] = useState(false);
  const [token, setToken] = useSessionStorage("token", "");
  const { register, handleSubmit, formState } = useForm<IUserLogin>({
    resolver: yupResolver(userSchema),
  });
  const { errors } = formState;
  const sendCredentials = (data: IUserLogin) => {
    fLogin(data)
      .then((respond) => {
        setStateLoginButton(true);
        console.log(respond.data.token);
        setToken(respond.data.token);
        navigate(`/auth`, { replace: true });
      })
      .catch((err) => {
        setStateLoginButton(false);
      });
  };
  const handleLoginButton = () => {};
  return (
    <form onSubmit={handleSubmit(sendCredentials)}>
      <LayoutLoginCardInput>
        <Title $wordColor="black">Iniciar sesion</Title>
        <LayoutInputs>
          <LayoutTextInput>
            <Text $wordColor="black">Usuario :</Text>
            <TextField
              sx={{ input: { color: "white" } }}
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            ></TextField>
          </LayoutTextInput>
          <LayoutTextInput>
            <Text $wordColor="black">Contraseña :</Text>
            <TextField
              type="password"
              sx={{ input: { color: "white" } }}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            ></TextField>
          </LayoutTextInput>
        </LayoutInputs>
        <StyledButton disabled={stateLoginButton} $btype="ns">
          Ingresar
        </StyledButton>
      </LayoutLoginCardInput>
    </form>
  );
};
export default LoginCardInput;
