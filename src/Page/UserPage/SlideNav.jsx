import {
    IoAccessibilityOutline,
    IoAccessibility,
    IoAddCircleOutline,
    IoAddCircle,
    IoHeartOutline,
    IoHeart,
} from "react-icons/io5";
import { useState, useEffect } from "react";
import "./SlideNav.css"

const SlideNav = ({ nowSelected, setNowSelected, joinedRef, type }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 500);

        window.addEventListener("resize", handleResize);

        if (type !== "my-page") {
            document.documentElement.style.setProperty("--slideNavWidth", "calc(500px / 3 * 2)");
            document.documentElement.style.setProperty("--slideNavWidthSmall", "calc(330px / 3 * 2)");
            document.documentElement.style.setProperty("--slideNavCount", 2);
        } else {
            document.documentElement.style.setProperty("--slideNavWidth", "500px");
            document.documentElement.style.setProperty("--slideNavWidthSmall", "330px");
            document.documentElement.style.setProperty("--slideNavCount", 3);
        }
        return () => {
            window.removeEventListener("resize", handleResize);
        };        
    }, [type]);

    return (
		<div className="slideNav">
			<div
				className={`slideNavBtn slideNavJoinedBtn ${
					nowSelected === 0 ? "slideNavSelectedContent" : ""
				}`}
				ref={joinedRef}
				onClick={() => setNowSelected(0)}
			>
				{nowSelected === 0 ? (
					<IoAccessibility className="ionicon" />
				) : (
					<IoAccessibilityOutline className="ionicon" />
				)}
				{!isMobile && "참여"}
			</div>
			<div
				className={`slideNavBtn slideNavCreatedBtn ${
					nowSelected === 1 ? "slideNavSelectedContent" : ""
				}`}
				onClick={() => setNowSelected(1)}
			>
				{nowSelected === 1 ? (
					<IoAddCircle className="ionicon" />
				) : (
					<IoAddCircleOutline className="ionicon" />
				)}
				{!isMobile && "제작"}
			</div>
			{type === "my-page" && (
				<div
					className={`slideNavBtn slideNavLikedBtn ${
						nowSelected === 2 ? "slideNavSelectedContent" : ""
					}`}
					onClick={() => setNowSelected(2)}
				>
					{nowSelected === 2 ? (
						<IoHeart className="ionicon" />
					) : (
						<IoHeartOutline className="ionicon" />
					)}
					{!isMobile && "좋아요"}
				</div>
			)}
			<div className={`slideBtn select${nowSelected}`}></div>
		</div>
	);
};

export default SlideNav;