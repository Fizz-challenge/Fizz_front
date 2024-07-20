import { useState, useEffect } from "react";
// import axios from "axios";
import "./RegisterPage.css";

const RegisterPage = () => {
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		// const fetchData = async () => {
		// 	try {
		// 		const res = await axios.get("/api/category");
		// 		setCategories(res.data);
		// 	} catch (err) {
		// 		console.error(`fetch err: ${err}`);
		// 	}
		// };

		// fetchData();
		setCategories(["헬스", "음악", "독서", "금욕", "스포츠"]);
	}, []);

	const submitRegister = (event) => {
		event.preventDefault();
	};

	return (
		<>
			<div className="backgroundLeft"></div>
			<div className="backgroundRight"></div>
			<div className="allWrap">
				<div className="backWrap">
					<div className="title">Fizz!</div>
					<div className="desc"></div>
				</div>
				<div className="loginWrap">
					<div className="registerTitle">
						3개 이상의 주제를
						<br />
						골라주세요🍹
					</div>

					<form onSubmit={submitRegister} className="categoryForm">
						{categories.map((category, index) => (
							<div key={index} className="categoryDiv">
								<input
									className="categoryInput"
									type="checkbox"
									id={`category${index}`}
								/>
								<label htmlFor={`category${index}`}></label>
								<label htmlFor={`category${index}`}>
									{category}
								</label>
							</div>
						))}

						<div className="categoryContact">원하는 주제가 없나요? <span>문의하기</span></div>
						<button className="registerBtn" type="submit">
							회원가입
						</button>
					</form>
				</div>
			</div>
		</>
	);
};

export default RegisterPage;
