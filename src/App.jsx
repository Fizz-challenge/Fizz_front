import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FollowPage from './pages/FollowPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FollowPage />} />
      </Routes>
    </Router>
  );
};

export default App;
