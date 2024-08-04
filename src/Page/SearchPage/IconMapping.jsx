import { FaDumbbell, FaGuitar, FaBook, FaPrayingHands, FaFootballBall, FaUtensils, FaPaintBrush, FaLaptopCode, FaSeedling, FaPlane } from 'react-icons/fa';

const iconMapping = {
  헬스: <FaDumbbell style={{ color: '#A9A9A9' }} />,
  악기: <FaGuitar style={{ color: '#DEB887' }} />,
  책: <FaBook style={{ color: '#900C3F' }} />,
  금욕: <FaPrayingHands style={{ color: '#FFC300' }} />,
  스포츠: <FaFootballBall style={{ color: '#C70039' }} />,
  요리: <FaUtensils style={{ color: '#D3D3D3' }} />,
  예술: <FaPaintBrush style={{ color: '#e6a046' }} />,
  기술: <FaLaptopCode style={{ color: '#28B463' }} />,
  원예: <FaSeedling style={{ color: '#145A32' }} />,
  여행: <FaPlane style={{ color: '#3498DB' }} />
};

export default iconMapping;
