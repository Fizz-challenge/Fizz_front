import './App.css'
import Header from './Components/Header'
import { Route, Routes } from 'react-router-dom';
import MainPage from './Pages/MainPage/MainPage';
import VideoDetail from './Pages/DetailVideoPage/VideoDetail';
import FollowPage from './pages/FollowPage';
import SearchPage from './pages/SearchPage';

const App = () => {
  return (
    <>
      <Header />
      <div className='content-wrapper'>
      <Routes>
          <Route exact path="/" element={<MainPage />} />
          <Route path="/video/:id" element={<VideoDetail />} />
          <Route path="/follow" element={<FollowPage />} />
          <Route path="/search" element={<SearchPage />} />
      </Routes>
      </div>
</>
  )
}

export default App;