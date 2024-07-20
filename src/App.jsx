import './App.css'
import Header from './Components/Header'
import { Route, Routes } from 'react-router-dom';
import MainPage from './Page/MainPage/MainPage';
import VideoDetail from './Page/DetailVideoPage/VideoDetail';
import FollowPage from './Page/FollowPage/FollowPage';
import SearchPage from './Page/SearchPage/SearchPage';

function App() {

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

export default App