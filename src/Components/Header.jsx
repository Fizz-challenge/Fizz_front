import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { FaHome, FaSearch, FaHeart, FaUser, FaGithub,  FaUniversity } from 'react-icons/fa';
import { LuPlusSquare } from "react-icons/lu";
import NewLogo from '../assets/NewLogo.svg';
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
      <div className='header-top' onClick={() => navigate('/')}><img src={NewLogo} alt="Fizz Logo" /></div>
      <nav className="header-sections">
        <ul>
          <li>
            <Link to="/" className={isActiveHome ? 'active' : ''}>
              <FaHome className="icon" /> 홈
            </Link>
          </li>
          <li>
            <Link to="/search" className={urlPath === '/search' || urlPath.startsWith('/category') ? 'active' : ''}>
              <FaSearch className="icon" /> 탐색
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
      <div className='header-extra'>
      <div className='footer-info'>
        <p>LIKELION 12th</p>
        <div className="info-links">
          <a 
            href="https://github.com/Fizz-challenge" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
          >
            <FaGithub className="github-icon" />
          </a>
          <a 
            href="https://www.kumoh.ac.kr/ko/index.do" 
            target="_blank" 
            rel="noopener noreferrer"
            className="university-link"
          >
            <FaUniversity className="university-icon" />
          </a>
        </div>
      </div>
    </div>
    </header>
  );
};

export default Header;
