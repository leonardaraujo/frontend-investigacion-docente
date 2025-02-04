import { GlobalStyle } from "./components/style/Globalstyle";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthGuard from "./guards/Auth.guard";
import Login from "./pages/public/Login";
import RoutesAppPrivate from "./routes/RoutesAppPrivate";
import { Navigate } from "react-router-dom";
function App() {
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route
          path="/"
          element={<Navigate to={"/auth/home"}></Navigate>}
        ></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route element={<AuthGuard />}>
          <Route path={`auth/*`} element={<RoutesAppPrivate />}></Route>
        </Route>
        <Route
          path="*"
          element={<p>awazszzzdsadsdasddddddddddddddddddddddddddddddd</p>}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
