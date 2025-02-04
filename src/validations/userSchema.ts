import * as yup from "yup";
import IUserLogin from "../interfaces/UserLogin.interface";
const userSchema = yup.object<IUserLogin>().shape({
  email: yup.string().trim().required("Es necesario el usuario"),
  password: yup.string().required("Es necesaria la contraseña"),
});
export default userSchema;
