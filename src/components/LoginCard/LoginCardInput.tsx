// @ts-nocheck
import {
	LayoutInputs,
	LayoutLoginCardInput,
} from "../style/login/LoginCard.styles";
import { Text, Title } from "../style/general/Text.styles";
import { LayoutTextInput } from "../style/login/LoginCard.styles";
import IUserLogin from "../../interfaces/UserLogin.interface";
import { set, useForm } from "react-hook-form";
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
	const [error, setError] = useState("");
	const { register, handleSubmit, formState } = useForm<IUserLogin>({
		resolver: yupResolver(userSchema),
	});
	const { errors } = formState;
	const sendCredentials = (data: IUserLogin) => {
		setStateLoginButton(true);
		fLogin(data)
			.then((respond) => {
				console.log(respond.data.token);
				setToken(respond.data.token);
				navigate(`/auth`, { replace: true });
			})
			.catch((err) => {
				setStateLoginButton(false);
				console.log(err.response?.data || "Error en el servidor");
				setError(err.response?.data?.message);
			})
			.finally(() => {
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
						<label htmlFor="email">
							<Text $wordColor="black">Usuario :</Text>
						</label>
						<TextField
							id="email"
							sx={{ input: { color: "white" } }}
							{...register("email")}
							error={!!errors.email}
							helperText={errors.email?.message}
						></TextField>
					</LayoutTextInput>
					<LayoutTextInput>
						<label htmlFor="password">
							<Text $wordColor="black">Contraseña :</Text>
						</label>
						<TextField
							id="password"
							type="password"
							sx={{ input: { color: "white" } }}
							{...register("password")}
							error={!!errors.password}
							helperText={errors.password?.message}
						></TextField>
					</LayoutTextInput>
				</LayoutInputs>
				<p style={{color:"red"}}>{error || ""}</p>
				<StyledButton type="submit" disabled={stateLoginButton} $btype="ns">
					Ingresar
				</StyledButton>
			</LayoutLoginCardInput>
		</form>
	);
};

export default LoginCardInput;
