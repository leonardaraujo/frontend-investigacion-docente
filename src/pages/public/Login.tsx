import { LayoutLogin } from '../../components/style/layout/Login.layout';
import Logincard from '../../components/LoginCard/Logincard';
import { Navigate } from 'react-router-dom';
const Login = () => {
  const token = sessionStorage.getItem('token');
  if (token) {
    return <Navigate to={"/auth/home"} replace />;
  } else {
    return (
      <LayoutLogin>
        <Logincard></Logincard>
      </LayoutLogin>
    );
  }
};
export default Login;
