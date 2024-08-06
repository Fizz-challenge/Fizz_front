import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./NewChallengePage.css";
import "../NewPostPage/NewPost.css";
import { IoInformationCircleOutline } from "react-icons/io5";
import { categories } from "./categoriesData.jsx";
import NoticePopup from "../../Components/NoticePopup.jsx";

const NewChallengePage = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [titleCharCount, setTitleCharCount] = useState(0);
	const [descriptionCharCount, setDescriptionCharCount] = useState(0);
	const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
	const [animateText, setAnimateText] = useState(false);
	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [popupMessage, setPopupMessage] = useState("");
	const fizzLogoRef = useRef(null);

	const token = localStorage.getItem("accessToken");
	const navigate = useNavigate();

	useEffect(() => {
		setAnimateText(true);
		if (!token) {
			setPopupMessage("로그인이 필요한 서비스입니다.");
			setIsPopupVisible(true);
		}
	}, [token]);

	const handleTitleChange = (event) => {
		const value = event.target.value.replace(/#/g, "");
		setTitle(value.substring(0, 20));
		setTitleCharCount(value.length > 20 ? 20 : value.length);
	};

	const handleDescriptionChange = (event) => {
		const value = event.target.value;
		setDescription(value.substring(0, 30));
		setDescriptionCharCount(value.length > 30 ? 30 : value.length);
	};

	const handleCategoryClick = (id) => {
		setSelectedCategory(id);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const challengeData = {
			categoryId: selectedCategory,
			title,
			description,
			isActive: true,
		};

		try {
			const response = await axios.post(
				"https://gunwoo.store/api/challenge",
				challengeData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);

			console.log("Challenge Created:", response.data);
			setPopupMessage("챌린지 생성에 성공하였습니다");
			setIsPopupVisible(true);
		} catch (error) {
			console.error("Error creating challenge:", error);
			setPopupMessage("챌린지 생성에 실패했습니다. 다시 시도해주세요.");
			setIsPopupVisible(true);
		}
	};

	const handleAnimationEnd = () => {
		if (fizzLogoRef.current) {
			fizzLogoRef.current.classList.add("scale-fizz");
		}
	};

	return (
		<div className="new-challenge-page">
			<div className="new-challenge-container">
				<div className="new-challenge-left">
					<label>
						<div className="category-selection-title">카테고리 선택</div>
						<span className="form-plus form-plus2">
							<IoInformationCircleOutline />
							카테고리는 한가지만 선택 가능합니다.
						</span>
					</label>
					<div className="category-selection">
						{categories.map((category) => (
							<div
								key={category.id}
								className={`category-card ${
									selectedCategory === category.id
										? "selected"
										: ""
								}`}
								onClick={() => handleCategoryClick(category.id)}
							>
								<div className="category-icon">
									{category.icon}
								</div>
								<h3>{category.name}</h3>
							</div>
						))}
					</div>
				</div>
				<div className="new-challenge-right">
					<p
						className={`new-challenge-text ${
							animateText ? "animate" : ""
						}`}
						onAnimationEnd={handleAnimationEnd}
					>
						새로운 챌린지를
					</p>
					<img ref={fizzLogoRef} src="../img/logo.png" alt="Fizz Logo" />
					<form onSubmit={handleSubmit}>
						<label>
							챌린지 제목
							<span className="form-plus">
								<IoInformationCircleOutline />
								작성한 챌린지명은 #OOO 으로 생성됩니다.
								ex.오운완 → #오운완
							</span>
						</label>
						<div className="input-wrapper">
							<input
								type="text"
								id="title"
								value={title}
								onChange={handleTitleChange}
								className="challenge-input"
								placeholder="챌린지명을 작성해주세요"
							/>
							<span className="char-count">
								{titleCharCount}/20
							</span>
						</div>
						<label>해당 챌린지 설명</label>
						<div className="input-wrapper">
							<input
								id="description"
								value={description}
								onChange={handleDescriptionChange}
								className="challenge-form-description"
								placeholder="챌린지에 대한 간단한 소개를 작성해주세요"
							/>
							<span className="char-count">
								{descriptionCharCount}/30
							</span>
						</div>
						<div className="upload-info">
							<div>
								<IoInformationCircleOutline />
								<span>
									챌린지 주제는 법적 문제를 일으킬 수 있는
									내용을 포함하지 않아야 합니다.
								</span>
							</div>
							<div>
								<IoInformationCircleOutline />
								<span>
									참가자가 안전하게 챌린지에 참여할 수 있도록
									유의하세요.
								</span>
							</div>
							<div>
								<IoInformationCircleOutline />
								<span>
									챌린지 관련 정보는 정확하고 신뢰할 수 있는
									자료를 바탕으로 제공되어야 합니다.
								</span>
							</div>
							<div>
								<IoInformationCircleOutline />
								<span>
									챌린지를 주최할 때는 Fizz 커뮤니티
									가이드라인을 준수해야 합니다.
								</span>
							</div>
							<button
								className={`create-challenge-button ${
									!title || !description ? "disabled" : ""
								}`}
								disabled={!title || !description}
							>
								챌린지 생성
							</button>
						</div>
					</form>
				</div>
			</div>
			{isPopupVisible && (
				<NoticePopup
					setIsPopupVisible={setIsPopupVisible}
					popupStatus={[popupMessage, "#2DA7FF"]}
					buttonStatus={{
						msg: "확인",
						action: () =>
							navigate(token ? `/challenge/${title}` : "/login"),
					}}
				/>
			)}
		</div>
	);
};

export default NewChallengePage;
