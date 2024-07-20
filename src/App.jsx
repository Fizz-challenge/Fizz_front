import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/LoginPage/LoginPage.jsx";
import Register from "./Pages/RegisterPage/RegisterPage.jsx";
import User from "./Pages/UserPage/UserPage.jsx";

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
