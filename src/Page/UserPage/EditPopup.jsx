import { useState, useRef } from "react";
import { TbEdit } from "react-icons/tb";
import NoticePopup from "../../Components/NoticePopup.jsx";
import styles from "./EditPopup.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditPopup = ({ setIsEditPopupVisible, userInfo }) => {
	const navigate = useNavigate();
	const [isClosing, setIsClosing] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [isDuplicateId, setIsDuplicateId] = useState(false);
	const [isInvalidEmail, setIsInvalidEmail] = useState(false);
	const [isNoticePopupVisible, setIsNoticePopupVisible] = useState(false);
	const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
	const [noticePopupStatus, setNoticePopupStatus] = useState([]);
	const [isBasicProfile, setIsBasicProfile] = useState(false);
	const idRef = useRef(null);
	const nameRef = useRef(null);
	const descRef = useRef(null);
	const emailRef = useRef(null);
	const fileRef = useRef(null);

	const closePopup = () => {
		setIsClosing(true);
		setTimeout(() => {
			setIsEditPopupVisible(false);
		}, 300);
	};

	const handleEditImageClick = () => {
		fileRef.current.click();
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setIsBasicProfile(false);
			setSelectedImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const validateId = async () => {
		try {
			const res = await axios.get(`https://gunwoo.store/api/user/check/profileId`, {
				params: { "profileId": idRef.current.value }
			});
			const isDuplicate = res.data.data.isDuplicate;
			const isCurrentUser = idRef.current.value === localStorage.getItem("profileId");
			if (isDuplicate) {
				if (isCurrentUser) {
					setNoticePopupStatus(["이미 사용 중인 아이디입니다", "#2DA7FF"]);
					setIsDuplicateId(false);
				} else {
					setNoticePopupStatus(["이미 등록된 아이디입니다", "#ff7070"]);
					setIsDuplicateId(true);
				}
			} else {
				setNoticePopupStatus(["사용 가능한 아이디입니다", "#2DA7FF"]);
				setIsDuplicateId(false);
			}
			setIsNoticePopupVisible(true);
		} catch (err) {
			setNoticePopupStatus(["사용할 수 없는 아이디입니다", "#ff7070"]);
			setIsNoticePopupVisible(true);
			setIsDuplicateId(true);
		}
	};

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	const validateEmail = (e) => {
		setIsInvalidEmail(!emailRegex.test(e.target.value));
	};

	const submitProfile = async () => {
		if (isDuplicateId) {
			validateId();
		} else if (nameRef.current.value === "") {
			setNoticePopupStatus(["닉네임을 입력해주세요", "#ff7070"]);
			setIsNoticePopupVisible(true);
		} else if (isInvalidEmail) {
			setNoticePopupStatus(["올바른 이메일 형식이 아닙니다", "#ff7070"]);
			setIsNoticePopupVisible(true);
		} else {
			try {
				let profileImageUrl = userInfo.profileImage;
				if (selectedImage) {
					const formData = new FormData();
					formData.append("file", selectedImage);
					const uploadResponse = await axios.post("https://gunwoo.store/api/files/profile-image/upload", formData, {
						headers: {
							"Content-Type": "multipart/form-data",
							"Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
						},
					});
					profileImageUrl = uploadResponse.data;
				}
				if (isBasicProfile) {
					profileImageUrl = null;
				}
				await axios.patch("https://gunwoo.store/api/user/me", {
					email: emailRef.current.value,
					nickname: nameRef.current.value,
					profileId: idRef.current.value,
					profileImage: profileImageUrl,
					aboutMe: descRef.current.value
				}, {
					headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
				});
				localStorage.setItem("profileId", idRef.current.value);
				window.location.reload();
			} catch (err) {
				if (err.response?.data?.code === "U003") {
					setNoticePopupStatus(["이 이메일은 이미 사용 중입니다", "#ff7070"]);
				} else {
					console.error(err);
				}
				setIsNoticePopupVisible(true);
			}
		}
	};

	const navigateToDeletePage = () => {
		navigate("/delete-profile");
	};

	const setBasicProfile = () => {
		setIsBasicProfile(true);
		setSelectedImage(null);
	}

	return (
		<>
			{isDeletePopupVisible && (
				<NoticePopup
					setIsPopupVisible={setIsDeletePopupVisible}
					popupStatus={["정말 삭제하시겠습니까?", "#ff3636"]}
					buttonStatus={{
						bgcolor: "#ff3636",
						color: "#ffffff",
						msg: "삭제",
						action: navigateToDeletePage,
					}}
					noButton={true}
				/>
			)}
			{isNoticePopupVisible && (
				<NoticePopup
					setIsPopupVisible={setIsNoticePopupVisible}
					popupStatus={noticePopupStatus}
				/>
			)}
			<div
				className={`${styles.back} ${isClosing ? styles.fadeout : ""}`}
				onClick={closePopup}
			></div>
			<div
				className={`${styles.popup} ${
					isClosing ? styles.closePopup : ""
				}`}
			>
				<div className={styles.close} onClick={closePopup}>
					&times;
				</div>
				<div className={styles.title}>프로필 수정</div>
				<div className={styles.imgBtn} onClick={handleEditImageClick}>
					<input
						type="file"
						ref={fileRef}
						onChange={handleImageChange}
						style={{ display: "none" }}
						accept=".png, .jpg, .jpeg"
					/>
					<TbEdit className={styles.imgBtnIcon} />
				</div>
				<div className={styles.img}>
					<img
						src={
							isBasicProfile
								? "../img/profile.jpg"
								: imagePreview ||
								  userInfo.profileImage ||
								  "../img/profile.jpg"
						}
						alt="프로필 이미지"
					/>
				</div>
				<div className={styles.setBasic} onClick={setBasicProfile}>
				{userInfo.profileImage || imagePreview ? (!isBasicProfile ? "이미지 삭제" : "") : ""}
				</div>
				<input
					type="text"
					className={styles.id}
					ref={idRef}
					defaultValue={userInfo.profileId}
					onChange={() => setIsDuplicateId(true)}
					style={{
						borderColor: isDuplicateId ? "#ff7070" : "#2DA7FF",
					}}
					id="profileId"
					required
				/>
				<label htmlFor="profileId">아이디</label>
				<button
					className={`${styles.checkId} hoverBtns`}
					type="button"
					onClick={validateId}
				>
					중복확인
				</button>
				<input
					type="text"
					className={styles.name}
					ref={nameRef}
					defaultValue={userInfo.nickname}
					id="profileName"
					required
				/>
				<label htmlFor="profileName">닉네임</label>
				<input
					type="text"
					className={styles.desc}
					ref={descRef}
					defaultValue={userInfo.aboutMe}
					id="profileDesc"
					required
				/>
				<label htmlFor="profileDesc">한줄설명</label>
				<input
					type="text"
					className={styles.email}
					ref={emailRef}
					defaultValue={userInfo.email}
					onChange={validateEmail}
					style={{
						borderColor: isInvalidEmail ? "#ff7070" : "#2DA7FF",
					}}
					id="profileEmail"
					required
				/>
				<label htmlFor="profileEmail">이메일</label>
				<div
					className={styles.delete}
					onClick={() => setIsDeletePopupVisible(true)}
				>
					계정삭제
				</div>
				<div
					className={`${styles.submit} hoverBtns`}
					onClick={submitProfile}
				>
					수정
				</div>
			</div>
		</>
	);
}

export default EditPopup;