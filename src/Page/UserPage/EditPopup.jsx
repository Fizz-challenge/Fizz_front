import { useState } from "react";
import "./EditPopup.css"

const EditPopup = ({ setEditPopup, userInfo }) => {
    const [closePopup, setClosePopup] = useState(false);

    const closePopupf = () => {
        setClosePopup(true);
        setTimeout(() => {
            setEditPopup(false);
        }, 500);
    }

    return (
		<>
			<div
				className={`editPopupBack ${closePopup ? "fadeout" : ""}`}
				onClick={closePopupf}
			></div>
			<div className={`editPopup ${closePopup ? "closePopup" : ""}`}>
				<div className="editPopupContent">
                    <div className="editPopupClose" onClick={closePopupf}>&times;</div>
                    <div className="editPopupProfileTitle">프로필 수정</div>
                    <div className="editPopupProfileImg"></div>
                    <input type="text" className="editPopupProfileName" defaultValue={userInfo.nickname} placeholder="닉네임" />
                    <input type="text" className="editPopupProfileDesc" defaultValue={userInfo.describe} placeholder="한줄설명" />
                    <div className="editPopupProfileDelete">계정삭제</div>
                    <div className="editPopupProfileSubmit">수정</div>
                </div>
			</div>
		</>
	);
}

export default EditPopup;