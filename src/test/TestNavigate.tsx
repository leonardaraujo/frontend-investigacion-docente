import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TestNavigate = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/ruta-inexistente");
  }, [navigate]);

  return null;
};

export default TestNavigate;
