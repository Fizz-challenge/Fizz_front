import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const PostText = ({ text, type }) => {
	const navigate = useNavigate();
	const ref = useRef(null);
	const [displayedText, setDisplayedText] = useState(text);

	const truncateText = () => {
		if (ref.current) {
			const { clientWidth } = ref.current;
			const context = document.createElement("canvas").getContext("2d");
			context.font = window.getComputedStyle(ref.current).font;

			let truncatedText = text;

			while (context.measureText(truncatedText).width > clientWidth - 20) {
				truncatedText = truncatedText.slice(0, -1);
			}

			if (truncatedText.length < text.length) {
				truncatedText += "...";
			}

			setDisplayedText(truncatedText);
		}
	};

	useEffect(() => {
		const resizeObserver = new ResizeObserver(truncateText);

		if (ref.current) {
			resizeObserver.observe(ref.current);
		}

		truncateText();

		return () => {
			if (ref.current) {
				resizeObserver.unobserve(ref.current);
			}
		};
	}, [text]);

	const goChallenge = () => {
		navigate(`/challenge/${text.substring(1)}`);
	}

	return (
		<>
			{type === "title" ? (
				<div className="profilePostTitle" ref={ref}>
					{displayedText}
				</div>
			) : type === "challenge" ? (
				<div
					className="profilePostChallenge"
					ref={ref}
					onClick={goChallenge}
				>
					{displayedText}
				</div>
			) : type === "titleMini" ? (
				<div className="profilePostTitleMini" ref={ref}>
					{displayedText}
				</div>
			) : type === "challengeMini" ? (
				<div
					className="profilePostChallengeMini"
					ref={ref}
					onClick={goChallenge}
				>
					{displayedText}
				</div>
			) : (
				<div className="profilePostDesc" ref={ref}>
					{displayedText}
				</div>
			)}
		</>
	);
};

export default PostText;
