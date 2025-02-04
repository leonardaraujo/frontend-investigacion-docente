import { Routes, Route, useLocation } from "react-router-dom";
const RoutesWithNotFound = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  console.log(`Ruta no encontrada ${location.pathname}`);
  return (
    <Routes>
      {children}
      <Route path="*" element={<p>Ruta no encontrada</p>}></Route>
    </Routes>
  );
};
export default RoutesWithNotFound;
