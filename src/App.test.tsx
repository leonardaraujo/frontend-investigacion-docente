import {
  act,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import App from "./App";
describe("Render App", () => {
  it("renders App component", () => {
    render(<App />);
  });
});

describe("App Component", () => {
  test("redirects to error page if route does not exist", async () => {
    render(<App />); // Renderizamos la app

    act(() => {
      window.history.pushState({}, "Test Page", "/ruta-inexistente");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    await waitFor(() => {
      expect(screen.getByText(/no existe esta ruta/i)).toBeInTheDocument();
    });
  });
});
