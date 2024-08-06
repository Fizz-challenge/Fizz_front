import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import NoticePopup from "../../Components/NoticePopup.jsx";
import "./DeleteProfilePage.css";

const DeleteProfile = () => {
	const navigate = useNavigate();
	const [isConfirmed, setIsConfirmed] = useState(false);
	const [isConfirmedPopupVisible, setIsConfirmedPopupVisible] = useState(false);

	const handleCheckboxChange = (event) => {
		setIsConfirmed(event.target.checked);
	};

	const handleProfileDeletion = () => {
		const registration = localStorage.getItem("registration");
		window.location.href = `https://gunwoo.store/api/user/oauth2/${registration}?redirect_uri=http://fizz-sigma.vercel.app&mode=unlink`;
		localStorage.removeItem("accessToken");
		localStorage.removeItem("profileId");
		localStorage.removeItem("registration");
	};

	return (
		<>
			{isConfirmedPopupVisible && (
				<NoticePopup
					setIsPopupVisible={setIsConfirmedPopupVisible}
					popupStatus={["정말 삭제하시겠습니까?", "#ff3636"]}
					buttonStatus={{
						bgcolor: "#ff3636",
						color: "#ffffff",
						msg: "삭제",
						action: handleProfileDeletion,
					}}
					noButton={true}
				/>
			)}
			<div className="deleteProfileBackBtn" onClick={() => navigate("/profile/my-page")}>
				<IoChevronBack />
			</div>
			<div className="deleteProfileTitle">지금 떠나면 아쉬워요 🥺</div>
			<div className="deleteProfileDesc">
				Fizz!를 그만두기 전에 한번만 확인해주세요.
			</div>
			<div className="deleteProfileNotice">
				<div>
					- 챌린지, 게시물, 프로필 등 활동했던 모든 정보가{" "}
					<span style={{ color: "#ff0000" }}>영원히 삭제</span>됩니다.
				</div>
				<div>
					- 삭제된 정보는{" "}
					<span style={{ color: "#ff0000" }}>
						영원히 복구가 불가능
					</span>
					합니다.
				</div>
				<div>
					- Fizz!는 항상 당신의{" "}
					<span style={{ color: "#2DA7FF" }}>건강 챌린지를 응원</span>
					합니다.
				</div>
			</div>
			<input
				className="checkInput"
				type="checkbox"
				id="checkInput"
				onChange={handleCheckboxChange}
			/>
			<label htmlFor="checkInput"></label>
			<label htmlFor="checkInput">확인했습니다</label>
			<div
				className="deleteProfileBtn hoverBtns"
				style={{ backgroundColor: isConfirmed ? "#ff3636" : "#d9d9d9" }}
				onClick={() => {
					if (isConfirmed) setIsConfirmedPopupVisible(true);
				}}
			>
				계정 삭제
			</div>
		</>
	);
};

export default DeleteProfile;
