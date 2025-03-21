import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LoginCardInput from "../components/LoginCard/LoginCardInput";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { fLogin } from "../fetch/fUser";
import { waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
// Mock de fLogin
vi.mock("../fetch/fUser", () => ({
	fLogin: vi.fn(),
}));

// Mock de useNavigate (Separado correctamente)
vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: vi.fn(),
	};
});

describe("LoginCardInput Component", () => {
	// Prueba: Verifica que el componente se renderiza correctamente
	test("renders LoginCardInput component", () => {
		render(
			<BrowserRouter>
				<LoginCardInput />
			</BrowserRouter>,
		);

		expect(screen.getByText("Iniciar sesion")).toBeInTheDocument();
		expect(screen.getByText("Usuario :")).toBeInTheDocument();
		expect(screen.getByText("Contraseña :")).toBeInTheDocument();
		expect(screen.getByText("Ingresar")).toBeInTheDocument();
	});

	test("shows validation errors when fields are empty", async () => {
		render(
			<BrowserRouter>
				<LoginCardInput />
			</BrowserRouter>,
		);

		await userEvent.click(screen.getByText("Ingresar")); // 🔹 Agregar `await` aquí

		expect(
			await screen.findByText((content, element) => {
				return (
					element.tagName.toLowerCase() === "p" &&
					content.includes("Es necesario el usuario")
				);
			}),
		).toBeInTheDocument();

		expect(
			await screen.findByText((content, element) => {
				return (
					element.tagName.toLowerCase() === "p" &&
					content.includes("Es necesaria la contraseña")
				);
			}),
		).toBeInTheDocument();
	});

	// Prueba: Verifica que la función fLogin se llama con los datos correctos
	test("calls fLogin with correct data", async () => {
		(fLogin as jest.Mock).mockResolvedValue({ data: { token: "fake-token" } });

		render(
			<BrowserRouter>
				<LoginCardInput />
			</BrowserRouter>,
		);

		fireEvent.change(screen.getByLabelText("Usuario :"), {
			target: { value: "74875111@continental.edu.pe" },
		});
		fireEvent.change(screen.getByLabelText("Contraseña :"), {
			target: { value: "74875111" },
		});
		fireEvent.click(screen.getByText("Ingresar"));

		await waitFor(() => {
			expect(fLogin).toHaveBeenCalledWith({
				email: "74875111@continental.edu.pe",
				password: "74875111",
			});
		});
	});

	// Prueba: Verifica que el componente navega a la ruta correcta después de un inicio de sesión exitoso
	test("navigates to the correct route after successful login", async () => {
		const mockNavigate = vi.fn();
		(useNavigate as jest.Mock).mockReturnValue(mockNavigate); // Hacemos que useNavigate devuelva el mock

		(fLogin as jest.Mock).mockResolvedValue({ data: { token: "fake-token" } });

		render(
			<BrowserRouter>
				<LoginCardInput />
			</BrowserRouter>,
		);

		fireEvent.change(screen.getByLabelText("Usuario :"), {
			target: { value: "74875111@continental.edu.pe" },
		});
		fireEvent.change(screen.getByLabelText("Contraseña :"), {
			target: { value: "74875111" },
		});
		fireEvent.click(screen.getByText("Ingresar"));

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith("/auth", { replace: true });
		});
	});

	// Prueba: Verifica que el botón de inicio de sesión se desactiva mientras se está realizando el inicio de sesión
	test("disables the login button while logging in", async () => {
		(fLogin as jest.Mock).mockResolvedValue({ data: { token: "fake-token" } });

		render(
			<BrowserRouter>
				<LoginCardInput />
			</BrowserRouter>,
		);

		fireEvent.change(screen.getByLabelText("Usuario :"), {
			target: { value: "74875111@continental.edu.pe" },
		});
		fireEvent.change(screen.getByLabelText("Contraseña :"), {
			target: { value: "74875111" },
		});

		const loginButton = screen.getByText("Ingresar");

		fireEvent.click(loginButton);

		// 🔹 Esperar a que el botón se deshabilite
		await waitFor(() => expect(loginButton).toBeDisabled());
	});

	// Prueba: Verifica que se muestra un mensaje de error cuando la contraseña es incorrecta
	test("shows error message when password is incorrect", async () => {
		(fLogin as jest.Mock).mockRejectedValue({
			response: { data: { message: "Usuario o contraseña incorrectos" } },
		});

		render(
			<BrowserRouter>
				<LoginCardInput />
			</BrowserRouter>,
		);

		fireEvent.change(screen.getByLabelText("Usuario :"), {
			target: { value: "74875111@continental.edu.pe" },
		});
		fireEvent.change(screen.getByLabelText("Contraseña :"), {
			target: { value: "wrong-password" },
		});
		fireEvent.click(screen.getByText("Ingresar"));

		expect(
			await screen.findByText("Usuario o contraseña incorrectos"),
		).toBeInTheDocument();
	});
});
