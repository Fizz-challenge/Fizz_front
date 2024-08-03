import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegQuestionCircle, FaQuestionCircle } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";
import axios from "axios";
import NoticePopup from "../../Components/NoticePopup.jsx";
import Warning from "../../Components/Warning.jsx";
import "./RegisterPage.css";

const RegisterPage = () => {
	const navigate = useNavigate();
	const [isCheckPopupVisible, setIsCheckPopupVisible] = useState(false);
	const [canEnter, setCanEnter] = useState(true);
	const [step, setStep] = useState(0);
	const [categories, setCategories] = useState([]);
	const [isIdDuplicate, setIsIdDuplicate] = useState(true);
	const [isInvalidEmail, setIsInvalidEmail] = useState(true);
	const [isNoticePopupVisible, setIsNoticePopupVisible] = useState(false);
	const [noticePopupStatus, setNoticePopupStatus] = useState([]);
	const [isHoveringInfo, setIsHoveringInfo] = useState(false);
	const idRef = useRef(null);
	const emailRef = useRef(null);

	useEffect(() => {
		const fetchUserData = async () => {
			if (localStorage.getItem("accessToken")) {
				try {
					await axios.get("https://gunwoo.store/api/user/me", {
                        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
					});
					setCanEnter(false);
				} catch (err) {
					console.error(err);
				}
			} else {
				setCanEnter(false);
			}
		};

		const fetchCategories = async () => {
			try {
				const res = await axios.get("https://gunwoo.store/api/category");
				setCategories(res.data.data);
			} catch (err) {
				console.error(err);
			}
		};

		fetchUserData();
		fetchCategories();
	}, []);

	const checkId = async () => {
		try {
			const res = await axios.get("https://gunwoo.store/api/user/check/profileId", {
				params: { "profileId": idRef.current.value }
			});
			if (res.data.data.isDuplicate) {
				setNoticePopupStatus(["이미 등록된 아이디입니다", "#ff7070"]);
				setIsNoticePopupVisible(true);
				setIsIdDuplicate(true);
			} else {
				setNoticePopupStatus(["사용 가능한 아이디입니다", "#2DA7FF"]);
				setIsNoticePopupVisible(true);
				setIsIdDuplicate(false);
			}
		} catch (err) {
			console.error(err);
			setNoticePopupStatus(["사용할 수 없는 아이디입니다", "#ff7070"]);
			setIsNoticePopupVisible(true);
			setIsIdDuplicate(true);
		}
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	const validateEmail = (e) => {
		setIsInvalidEmail(!emailRegex.test(e.target.value));
	}

	const handleNextStep = (event) => {
		event.preventDefault();
		setStep(1);
	}

	const handleSubmitRegister = async (event) => {
		event.preventDefault();
		if (isIdDuplicate) {
			checkId();
		} else if (isInvalidEmail) {
			setNoticePopupStatus(["올바른 이메일 형식이 아닙니다", "#ff7070"]);
			setIsNoticePopupVisible(true);
		} else {
			try {
				await axios.post("https://gunwoo.store/api/user/login-info", {
					"profileId": idRef.current.value,
					"email": emailRef.current.value,
				}, {
					headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
				});
				setIsCheckPopupVisible(true);
			} catch (err) {
				if (err.response?.data?.code === "U003") {
					setNoticePopupStatus(["이 이메일은 이미 사용 중입니다", "#ff7070"]);
					setIsNoticePopupVisible(true);
				} else {
					console.error(err);
				}
			}
		}
	};

	const goToHome = () => {
		navigate("/");
	}

	if (!canEnter) {
		return <Warning />;
	}

	return (
		<>
			{isCheckPopupVisible && (
				<NoticePopup
					setIsPopupVisible={setIsCheckPopupVisible}
					popupStatus={["회원가입이 완료되었습니다!", "#2DA7FF"]}
					buttonStatus={{
						bgcolor: "#2DA7FF",
						color: "#ffffff",
						msg: "확인",
						action: goToHome,
					}}
					onClose={goToHome}
				/>
			)}
			{isNoticePopupVisible && (
				<NoticePopup
					setIsPopupVisible={setIsNoticePopupVisible}
					popupStatus={noticePopupStatus}
				/>
			)}
			<div className="loginBack"></div>
			<div className="loginAllWrap">
				<div className="loginBackWrap">
					<div className="loginLogo">Fizz!</div>
				</div>
				<div className="loginWrap">
					{step === 1 && (
						<div
							className="registerBackBtn"
							onClick={() => setStep(0)}
						>
							<IoChevronBack />
						</div>
					)}
					<div className="registerTitle">
						{step === 0
							? "관심있는 주제를\n골라주세요🍹"
							: "아이디와 이메일을\n등록해볼까요?"}
					</div>

					{step === 0 ? (
						<form onSubmit={handleNextStep} className="categoryForm">
							{categories.map((category) => (
								<div key={category.categoryId} className="categoryDiv">
									<input
										className="categoryInput"
										type="checkbox"
										id={`category${category.categoryId}`}
									/>
									<label htmlFor={`category${category.categoryId}`}></label>
									<label htmlFor={`category${category.categoryId}`}>
										{category.title}
									</label>
								</div>
							))}

							<div className="categoryContact">
								원하는 주제가 없습니다
								<span
									onMouseEnter={() => setIsHoveringInfo(true)}
									onMouseLeave={() => setIsHoveringInfo(false)}
								>
									{isHoveringInfo ? (
										<>
											<FaQuestionCircle />
											<div className="categoryContactInfo">
												회원가입 후 [문의하기] {">"} [카테고리 추가]
											</div>
										</>
									) : (
										<FaRegQuestionCircle />
									)}
								</span>
							</div>
							<button className="registerBtn hoverBtns" type="submit">
								다음
							</button>
						</form>
					) : (
						<form onSubmit={handleSubmitRegister} className="idForm">
							<input
								type="text"
								ref={idRef}
								className="registerInput registerIdInput"
								onChange={() => setIsIdDuplicate(true)}
								style={{
									borderColor: isIdDuplicate ? "#ff7070" : "#2DA7FF",
								}}
								id="registerId"
								required
							/>
							<label htmlFor="registerId">아이디</label>
							<button
								className="checkId hoverBtns"
								type="button"
								onClick={checkId}
							>
								중복확인
							</button>
							<input
								type="text"
								ref={emailRef}
								className="registerInput registerEmailInput"
								onChange={validateEmail}
								style={{
									borderColor: isInvalidEmail ? "#ff7070" : "#2DA7FF",
								}}
								id="registerEmail"
								required
							/>
							<label htmlFor="registerEmail">이메일</label>
							<button className="registerBtn" type="submit">
								시작하기
							</button>
						</form>
					)}
				</div>
			</div>
		</>
	);
};

export default RegisterPage;
