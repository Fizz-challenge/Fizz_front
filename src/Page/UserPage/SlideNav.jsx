import {
	IoAccessibilityOutline,
	IoAccessibility,
	IoAddCircleOutline,
	IoAddCircle,
	IoHeartOutline,
	IoHeart,
} from "react-icons/io5";
import "./SlideNav.css"

const SlideNav = ({ nowSelected, setNowSelected }) => {
	return (
		<div className="slideNav">
			<div
				className={`slideNavBtn slideNavJoinedBtn ${
					nowSelected == 0 ? "slideNavSelectedContent" : ""
				}`}
				onClick={() => setNowSelected(0)}
			>
				{nowSelected == 0 ? (
					<IoAccessibility className="ionicon" />
				) : (
					<IoAccessibilityOutline className="ionicon" />
				)}
				참여
			</div>
			<div
				className={`slideNavBtn slideNavCreatedBtn ${
					nowSelected == 1 ? "slideNavSelectedContent" : ""
				}`}
				onClick={() => setNowSelected(1)}
			>
				{nowSelected == 1 ? (
					<IoAddCircle className="ionicon" />
				) : (
					<IoAddCircleOutline className="ionicon" />
				)}
				제작
			</div>
			<div
				className={`slideNavBtn slideNavLikedBtn ${
					nowSelected == 2 ? "slideNavSelectedContent" : ""
				}`}
				onClick={() => setNowSelected(2)}
			>
				{nowSelected == 2 ? (
					<IoHeart className="ionicon" />
				) : (
					<IoHeartOutline className="ionicon" />
				)}
				좋아요
			</div>
			<div className={`slideBtn select${nowSelected}`}></div>
		</div>
	);
};

export default SlideNav;