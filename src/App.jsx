import './App.css'
import Header from './Components/Header'
import { Route, Routes } from 'react-router-dom';
import MainPage from './Pages/MainPage/MainPage';
import VideoDetail from './Pages/DetailVideoPage/VideoDetail';

function App() {

  return (
    <>
      <Header />
      <div className='content-wrapper'>
      <Routes>
          <Route exact path="/" element={<MainPage />} />
          <Route path="/video/:id" element={<VideoDetail />} />
      </Routes>
      </div>
</>
  )
}

export default App
