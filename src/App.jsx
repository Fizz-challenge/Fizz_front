import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FollowPage from './pages/FollowPage';
import SearchPage from './pages/SearchPage';

//123
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FollowPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
};

export default App;
