import { SiNaver } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import Warning from "../../Components/Warning.jsx";
import axios from "axios";
import "./LoginPage.css";

const LoginPage = () => {
	const navigate = useNavigate();

	const oauth2Login = (registration) => {
		localStorage.setItem("registration", registration);
		window.location.href = `https://gunwoo.store/api/user/oauth2/${registration}?redirect_uri=http://fizz-sigma.vercel.app/oauth2/callback&mode=login`;
	};

	if (localStorage.getItem("accessToken")) {
		return <Warning />;
	}
	
	return (
		<>
			<div className="loginBack"></div>
			<div className="loginAllWrap">
				<div className="loginBackWrap">
					<div className="loginLogo" onClick={() => navigate("/")}>
						Fizz!
					</div>
				</div>
				<div className="loginWrap">
					<div className="loginTitle">환영합니다</div>
					<hr className="loginDescLine" />
					<div className="loginDesc">
						&nbsp;5초만에{" "}
						<span style={{ color: "#2DA7FF" }}>Fizz!</span>🍹
					</div>
					<div
						className="loginBtn loginKakaoBtn hoverBtns"
						onClick={() => oauth2Login("kakao")}
					>
						<img className="kakaoIcon" src="../img/kakao.svg" />
						카카오 로그인
					</div>
					<div
						className="loginBtn loginNaverBtn hoverBtns"
						onClick={() => oauth2Login("naver")}
					>
						<SiNaver className="naverIcon" />
						네이버 로그인
					</div>
					<div
						className="loginBtn loginGoogleBtn hoverBtns"
						onClick={() => oauth2Login("google")}
					>
						<img
							className="googleIcon"
							src="../img/google.png"
						/>
						Google 로그인
					</div>
				</div>
			</div>
		</>
	);
};

export default LoginPage;
