import {
	ImageLogin,
	LayoutLoginCardLogo,
} from "../style/login/LoginCard.styles";
import { LOGO_IMAGES } from "../../conf/IMAGES.conf";
const LoginCardLogo = () => {
	return (
		<LayoutLoginCardLogo>
			<ImageLogin src={LOGO_IMAGES.UNIVERSIDAD_LOGO_LOGIN}></ImageLogin>
		</LayoutLoginCardLogo>
	);
};
export default LoginCardLogo;
