import { useNavigate } from "react-router-dom";
import "./Warning.css";

const Warning = ({ message }) => {
    const navigate = useNavigate();
    return (
        <>
            <div className="noTitle">{message ? message : "잘못된 접근입니다⚠️"}</div>
            <div
                className="goHomeBtn hoverBtns"
                onClick={() => navigate("/")}
            >
                돌아가기
            </div>
        </>
    );
}

export default Warning;