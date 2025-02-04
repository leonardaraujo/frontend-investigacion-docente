import { LayoutLoginCard } from "../style/login/LoginCard.styles";
import LoginCardInput from "./LoginCardInput";
import LoginCardLogo from "./LoginCardLogo";

const Logincard = () => {
  return (
    <LayoutLoginCard>
      <LoginCardInput></LoginCardInput>
      <LoginCardLogo></LoginCardLogo>
    </LayoutLoginCard>
  );
};
export default Logincard;
