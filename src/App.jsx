import './App.css'
import Header from './Components/Header'
import { Route, Routes } from 'react-router-dom';
import MainPage from './Pages/MainPage/MainPage';

function App() {

  return (
    <>
      <Header />
      <div className='content-wrapper'>
      <Routes>
        <Route exact path="/" element={<MainPage />} />
        </Routes>
        </div>
</>
  )
}

export default App
