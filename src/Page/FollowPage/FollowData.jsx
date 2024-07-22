const followData = [
  {
    following: '60',
    follower: '50',
    followingInfo: [
      {
        id: '1',
        nickname: '사용자1',
        profileImage: '/img/test.jpg',
        describe: '목표 달성까지 화이팅'
      },
      {
        id: '2',
        nickname: '사용자2',
        profileImage: '/img/test.jpg',
        describe: '같이 산책가자'
      },
      {
        id: '3',
        nickname: '사용자3',
        profileImage: '/img/test.jpg',
        describe: '좋은 책 추천 받습니다'
      },
      {
        id: '4',
        nickname: '사용자4',
        profileImage: '/img/test.jpg',
        describe: '휴가 때 뭐하지'
      },
    ],
    followingChallenge: [
      {
        challengeID: '1',
        challengeName: '오운완'
      },
      {
        challengeID: '2',
        challengeName: '기타연습'
      },
      {
        challengeID: '3',
        challengeName: '한강산책'
      },
      {
        challengeID: '4',
        challengeName: '오늘의 커피'
      },
      {
        challengeID: '5',
        challengeName: '천상연'
      },
    ],

    followerInfo: [
      {
        id: '1',
        nickname: '사용자1',
        profileImage: '/img/test.jpg',
        describe: '목표 달성까지 화이팅'
      },
      {
        id: '2',
        nickname: '사용자2',
        profileImage: '/img/test.jpg',
        describe: '같이 산책가자'
      },
      {
        id: '5',
        nickname: '사용자5',
        profileImage: '/img/test.jpg',
        describe: '운동 갈 사람'
      },
      {
        id: '6',
        nickname: '사용자6',
        profileImage: '/img/test.jpg',
        describe: '댄싱부'
      },
    ],
  },


  
];

const getFollowData = async (index) => {
  return followData[index] || null;
};

export default getFollowData;
