import { SiNaver } from "react-icons/si";
import axios from "axios";
import "./LoginPage.css";

const LoginPage = () => {

	const oauth2Login = async (registration) => {
		try {
			const res = await axios.post(`http://localhost:8080/api/user/oauth2/${registration}`, {
				redirect_uri: "http://localhost:5173/oauth2/callback",
				mode: "login"
			});

			window.location.href = res.data.authorizationUrl;
			setCategories(res.data);
		} catch (err) {
			console.error(`err: ${err}`);
		}
	};

	return (
		<>
			<div className="backgroundLeft"></div>
			<div className="backgroundRight"></div>
			<div className="allWrap">
				<div className="backWrap">
					<div className="title">Fizz!</div>
					{/* <div className="desc">매일매일이 색다른 건강 챌린지!</div> */}
				</div>
				<div className="loginWrap">
					<div className="loginTitle">환영합니다</div>
					<hr className="loginDescLine" />
					<div className="loginDesc">
						&nbsp;5초만에{" "}
						<span style={{ color: "#2DA7FF" }}>Fizz!</span>🍹
					</div>
					<div className="loginKakaoBtn" onClick={() => oauth2Login("kakao")}>
						<img className="kakaoIcon" src="../img/kakao.svg" />
						카카오 로그인
					</div>
					<div className="loginNaverBtn" onClick={() => oauth2Login("naver")}>
						<SiNaver className="naverIcon" />
						네이버 로그인</div>
				</div>
			</div>
		</>
	);
};

export default LoginPage;
