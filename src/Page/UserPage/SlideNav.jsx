import {
    IoAccessibilityOutline,
    IoAccessibility,
    IoAddCircleOutline,
    IoAddCircle,
    IoHeartOutline,
    IoHeart,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./SlideNav.css"

const SlideNav = ({ nowSelected, setNowSelected, joinedRef, createdRef, likedRef }) => {
	const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 500);

        window.addEventListener("resize", handleResize);

		return () => {
            window.removeEventListener("resize", handleResize);
        };        
    }, [location]);

	useEffect(() => {
		navigate(`?content=${nowSelected}`)
	}, [nowSelected])

    return (
		<>
			<div className="slideNavLine"></div>
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
					ref={createdRef}
					onClick={() => setNowSelected(1)}
				>
					{nowSelected === 1 ? (
						<IoAddCircle className="ionicon" />
					) : (
						<IoAddCircleOutline className="ionicon" />
					)}
					{!isMobile && "제작"}
				</div>
				<div
					className={`slideNavBtn slideNavLikedBtn ${
						nowSelected === 2 ? "slideNavSelectedContent" : ""
					}`}
					ref={likedRef}
					onClick={() => setNowSelected(2)}
				>
					{nowSelected === 2 ? (
						<IoHeart className="ionicon" />
					) : (
						<IoHeartOutline className="ionicon" />
					)}
					{!isMobile && "좋아요"}
				</div>
				<div className={`slideBtn select${nowSelected}`}></div>
			</div>
		</>
	);
};

export default SlideNav;