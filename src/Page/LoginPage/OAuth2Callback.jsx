import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OAuth2Callback = () => {
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const accessToken = params.get("access_token");
		const isNewUser = params.get("is_new_user") === "true";

		if (accessToken) {
			localStorage.setItem("accessToken", accessToken);
			localStorage.setItem("nickname", "test");

			if (isNewUser) {
				navigate("/register");
			} else {
				navigate("/");
			}
		} else {
			console.error("액세스 토큰이 없습니다.");
		}
	}, [location, history]);

	return <div>처리중...</div>;
};

export default OAuth2Callback;
