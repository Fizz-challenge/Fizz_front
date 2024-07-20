import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./LoginPage/LoginPage.jsx";
import Register from "./RegisterPage/RegisterPage.jsx";
import User from "./UserPage/UserPage.jsx";

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/user/:userId" element={<User />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
