import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./AskPage.css";
import NoticePopup from "../../Components/NoticePopup";

const AskPage = () => {
	const [isScroll, setIsScroll] = useState(false);

	const [messages, setMessages] = useState([]);

    const [isNoticePopupVisible, setIsNoticePopupVisible] = useState(false);
    const [noticePopupStatus, setNoticePopupStatus] = useState([]);

    const chatEndRef = useRef(null);
    const categoryTitleRef = useRef(null);
    const categoryDescRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [messages]);

	const handleQuestionSelect = (question, answer, action) => {
		setMessages((prevMessages) => [
			...prevMessages,
			{ text: question, sender: "askBubbleUser" },
			{ text: answer, action: action, sender: "askBubbleBot" },
		]);

	};

    const askCategory = async () => {        
		try {
			const res = await axios.post(
				`https://gunwoo.store/api/category/user`,
				{
					title: categoryTitleRef.current.value,
					description: categoryDescRef.current.value,
				},
				{
					headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
				}
			);
            setNoticePopupStatus(["카테고리 제안을 제출했습니다", "#2DA7FF"]);
            setIsNoticePopupVisible(true)
            categoryTitleRef.current.value = "";
            categoryDescRef.current.value = "";
            
		} catch (err) {
            if (err.response.data.code === "U005") {
                setNoticePopupStatus(["로그인이 필요합니다", "#ff7070"]);
                setIsNoticePopupVisible(true);
            } else {
                console.error(err);
            }
		}
	};

	const questionsAndAnswers = [
		{
			question: "카테고리 추가",
			answer: "원하는 카테고리가 없다면 아래 폼에 카테고리 이름과 이유와 설명을 적어주세요.",
            action: (
                <div className="categoryAskForm">
                    <input className="categoryAskFormTitle" ref={categoryTitleRef} placeholder="카테고리 이름"></input>
                    <textarea className="categoryAskFormDesc" ref={categoryDescRef} placeholder="이유와 설명"></textarea>
                    <button className="categoryAskFormSubmit" onClick={askCategory}>제출</button>
                </div>
            )
		},
		{
			question: "계정을 삭제하고 싶어요",
			answer: "계정을 삭제하고 싶다면 로그인 후 [프로필] > [수정] > [계정삭제]를 누르시면 계정을 삭제할 수 있습니다.",
		},
	];

	const handleScroll = (event) => {
		// console.log(event.target.scrollTop);
		if (event.target.scrollTop !== 0) {
			setIsScroll(true);
		} else {
			setIsScroll(false);
		}
	}

	return (
		<>
            {isNoticePopupVisible && (
                <NoticePopup setIsPopupVisible={setIsNoticePopupVisible} popupStatus={noticePopupStatus} />
            )}
			<div className={`askChat ${isScroll ? "askChatScroll" : ""}`} onScroll={handleScroll}>
				{messages.map((msg, index) => (
					<div key={index} className={`askBubble ${msg.sender}`}>
						{msg.text}
                        {msg.action && msg.action}
					</div>
				))}
                <div ref={chatEndRef}></div>
			</div>
			<div className="askList">
				{questionsAndAnswers.map((qa, index) => (
					<button
                        className="hoverBtns"
						key={index}
						onClick={() =>
							handleQuestionSelect(qa.question, qa.answer, qa.action)
						}
					>
						{qa.question}
					</button>
				))}
			</div>
		</>
	);
};

export default AskPage;
