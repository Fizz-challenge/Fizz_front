import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const OAuth2Callback = () => {
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const token = params.get("access_token");
		const isNewUser = params.get("is_new_user") === "true";

		const fetchUserProfile = async () => {
			try {
				const res = await axios.get(`https://gunwoo.store/api/user/me`, {
					headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
				});
				localStorage.setItem("profileId", res.data.data.profileId);
			} catch (err) {
				console.error(err);
			}
		};

		if (token) {
			localStorage.setItem("accessToken", token);
			fetchUserProfile();

			navigate(isNewUser ? "/register" : "/");
		} else {
			console.error("엑세스 토큰이 없습니다");
		}
	}, [location, navigate]);

	return <div>처리중...</div>;
};

export default OAuth2Callback;
