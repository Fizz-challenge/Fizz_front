const videoData = [
  {
    id: '1',
    src: '/img/Download2.mp4',
    title: '나두 챌린지 참여',
    user: '사용자 1',
    userProfile: '/img/test.jpg',
    views: '34k',
    likes: '23.2k',
    comments: '1.2k',
    shares: '200',
    description: '오운완 챌린지 영상입니다. 함께 운동해요! #오운완',
    commentsData: [
      { id: 1, user: 'user1', text: '좋아요!' },
      { id: 2, user: 'user2', text: '멋지네요!' },
    ],
  },
  {
    id: '2',
    src: '/img/Download1.mp4',
    title: '비디오 2',
    user: '사용자 2',
    userProfile: '/img/test.jpg',
    views: '20k',
    likes: '23.2k',
    comments: '1.2k',
    shares: '200',
    description: '비디오 2 설명입니다.',
    commentsData: [
      { id: 1, user: 'user3', text: '재밌어요!' },
      { id: 2, user: 'user4', text: '잘 봤습니다!' },
    ],
  },
  {
    id: '3',
    src: '/img/Download.mp4',
    title: '비디오 3',
    user: '사용자 3',
    userProfile: '/img/test.jpg',
    views: '50k',
    likes: '23.2k',
    comments: '1.2k',
    shares: '200',
    description: '비디오 3 설명입니다.',
    commentsData: [
      { id: 1, user: 'user5', text: '대단해요!' },
      { id: 2, user: 'user6', text: '좋은 영상입니다!' },
    ],
  },
  {
    id: '4',
    src: '/img/Download3.mp4',
    title: '비디오 4',
    user: '사용자 4',
    userProfile: '/img/test.jpg',
    views: '54k',
    likes: '23.4k',
    comments: '1.4k',
    shares: '204',
    description: '비디오 4 설명입니다.',
    commentsData: [
      { id: 1, user: 'user7', text: '굉장해요!' },
      { id: 2, user: 'user8', text: '또 보고 싶어요!' },
    ],
  },
  {
    id: '5',
    src: '/img/Download4.mp4',
    title: '비디오 5',
    user: '사용자 5',
    userProfile: '/img/test.jpg',
    views: '55k',
    likes: '23.2k',
    comments: '1.2k',
    shares: '200',
    description: '비디오 5 설명입니다.',
    commentsData: [
      { id: 1, user: 'user9', text: '최고에요!' },
      { id: 2, user: 'user10', text: '잘 만들었어요!' },
    ],
  }
];

const getVideoData = async (index) => {
  return videoData[index] || null;
};

export default getVideoData;
