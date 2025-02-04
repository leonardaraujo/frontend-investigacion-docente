import uncpImage from "../../assets/images/uncp_logo.webp";
import {
  ImageLogin,
  LayoutLoginCardLogo,
} from "../style/login/LoginCard.styles";
const LoginCardLogo = () => {
  return (
    <LayoutLoginCardLogo>
      <ImageLogin src={uncpImage}></ImageLogin>
    </LayoutLoginCardLogo>
  );
};
export default LoginCardLogo;
