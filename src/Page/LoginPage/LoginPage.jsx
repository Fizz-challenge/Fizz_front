import { SiNaver } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {

	const navigate = useNavigate();

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
					<div className="loginKakaoBtn" onClick={() => navigate("../register")}>
						<img className="kakaoIcon" src="../img/kakao.svg" />
						카카오 로그인
					</div>
					<div className="loginNaverBtn" onClick={() => navigate("../register")}>
						<SiNaver className="naverIcon" />
						네이버 로그인</div>
				</div>
			</div>
		</>
	);
};

export default LoginPage;
