import { useState } from "react";
import style from "./NoticePopup.module.css";

const NoticePopup = ({
	setIsPopupVisible,
	popupStatus,
	buttonStatus = { bgcolor: "#2DA7FF", color: "#ffffff", msg: "확인", action: null },
	noButton = false,
	onClose = null,
}) => {
	const [isFadingOut, setIsFadingOut] = useState(false);

	const handleClosePopup = () => {
		if (onClose == null) {
			setIsFadingOut(true);
			setTimeout(() => {
				setIsPopupVisible(false);
			}, 300);			
		} else {
			onClose();
		}
	};

	return (
		<>
			<div
				className={`${style.back} ${isFadingOut ? style.fadeout : ""}`}
				onClick={handleClosePopup}
			></div>
			<div
				className={`${style.popup} ${isFadingOut ? style.closePopup : ""}`}
			>
				<div
					className={style.color}
					style={{ backgroundColor: popupStatus[1] }}
				></div>
				<div className={style.title}>{popupStatus[0]}</div>
				{noButton && (
					<div className={`${style.no} hoverBtns`} onClick={handleClosePopup}>
						취소
					</div>
				)}
				<div
					className={`${style.submit} hoverBtns`}
					onClick={buttonStatus.action ? buttonStatus.action : handleClosePopup}
					style={{
						backgroundColor: buttonStatus.bgcolor,
						color: buttonStatus.color,
					}}
				>
					{buttonStatus.msg}
				</div>
			</div>
		</>
	);
};

export default NoticePopup;
