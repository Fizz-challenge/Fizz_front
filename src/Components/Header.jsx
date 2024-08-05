import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { FaHome, FaSearch, FaHeart, FaUser } from 'react-icons/fa';
import { LuPlusSquare } from "react-icons/lu";
import FizzLogo from '../assets/Fizz.png';
import { GrInfo } from "react-icons/gr";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [urlPath, setUrlPath] = useState(location.pathname);

  useEffect(() => {
    setUrlPath(location.pathname);
  }, [location.pathname]);

  const isActiveHome = urlPath === '/' || /^\/[0-9]+$/.test(urlPath);

  return (
    <header className="header">
      <div className='header-top' onClick={() => navigate('/')}><img src={FizzLogo} alt="Fizz Logo" style={{color:"black"}}/></div>
      <nav className="header-sections">
        <ul>
          <li>
            <Link to="/" className={isActiveHome ? 'active' : ''}>
              <FaHome className="icon" /> 홈
            </Link>
          </li>
          <li>
            <Link to="/search" className={urlPath === '/search' ? 'active' : ''}>
              <FaSearch className="icon" /> 검색
            </Link>
          </li>
          <li>
            <Link to="/follow" className={urlPath === '/follow' ? 'active' : ''}>
              <FaHeart className="icon" /> 팔로잉
            </Link>
          </li>
          <li>
            <Link to="/profile/my-page" className={urlPath === '/profile/my-page' ? 'active' : ''}>
              <FaUser className="icon" /> 프로필
            </Link>
          </li>
          <li>
            <Link to="/new-challenge" className={urlPath === '/new-challenge' ? 'active' : ''}>
            <LuPlusSquare className="icon" /> 챌린지
            </Link>
          </li>
          <div className='header-line'></div>
          <li>
            <Link to="/ask" className={urlPath === '/ask' ? 'active' : ''}>
            <GrInfo className="icon" /> 문의
            </Link>
          </li>
          <li>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
