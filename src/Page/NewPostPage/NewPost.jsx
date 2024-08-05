import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { EventSourcePolyfill } from 'event-source-polyfill';
import FizzLogo from "../../assets/Fizz.png";
import axios from 'axios';
import Hls from 'hls.js';
import './NewPost.css';
import './PostInput.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Skeleton from 'react-loading-skeleton';
import { IoCloudUpload, IoInformationCircleOutline } from 'react-icons/io5';
import { IoIosArrowBack, IoIosArrowForward, IoIosClose } from 'react-icons/io';
import NoticePopup from '../../Components/NoticePopup.jsx';

const NewPost = () => {
  const { challenge } = useParams();
  const navigate = useNavigate();
  const [challengeExists, setChallengeExists] = useState(true);
  const [challengeId, setChallengeId] = useState('');
  const [video, setVideo] = useState(null);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [mediaType, setMediaType] = useState(null);
  const [titleCharCount, setTitleCharCount] = useState(0);
  const [descriptionCharCount, setDescriptionCharCount] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hlsUrl, setHlsUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const videoRef = useRef(null);
  const eventSourceRef = useRef(null);
  const newchallenge = `#${challenge}`;
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const checkChallengeExists = async () => {
      try {
        const response = await axios.get(`https://gunwoo.store/api/challenge/info?title=${challenge}`, {});
        if (!response.data.success) {
          setChallengeExists(false);
        }
        setChallengeId(response.data.data.challengeId);
        console.log(response.data.data.challengeId);
      } catch (error) {
        console.error('Error checking challenge:', error);
        setChallengeExists(false);
      }
    };

    checkChallengeExists();
  }, [challenge, token]);

  const subscribeToNotifications = useCallback(() => {
    const eventSource = new EventSourcePolyfill('https://gunwoo.store/api/notify/subscribe', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const handleOpen = () => {
      console.log("EventSource connected");
    };

    const handleFileEncodingEvent = (event) => {
      try {
        const eventData = event.data;
        console.log("Received message:", eventData);

        if (eventData.includes("ENCODING_FINISH")) {
          const parsedData = JSON.parse(eventData);
          setHlsUrl(parsedData.videoUrl);
          setThumbnail(parsedData.thumbnailUrl);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to handle event data:", error);
        console.error("Event data received:", event.data);
      }
    };

    const handleError = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    eventSource.onopen = handleOpen;
    eventSource.addEventListener("file-encoding-event", handleFileEncodingEvent);
    eventSource.onerror = handleError;

    eventSourceRef.current = eventSource;

    return () => {
      eventSource.removeEventListener("file-encoding-event", handleFileEncodingEvent);
      eventSource.close();
    };
  }, [token]);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        console.log("EventSource disconnected");
      }
    };
  }, []);

  useEffect(() => {
    if (hlsUrl) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(hlsUrl);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current.play();
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = hlsUrl;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current.play();
        });
      }
    }
  }, [hlsUrl]);

  const initiateUpload = async (fileName, fileType, fileSize, file) => {
    try {
      const response = await fetch('https://gunwoo.store/api/files/initiate-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          originalFileName: fileName,
          fileFormat: fileType,
          fileSize: fileSize
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log("1단계");
      setUploadProgress(20);
      await getPresignedUrl(data.uploadId, data.key, file);

      subscribeToNotifications();

    } catch (error) {
      console.error('Error initiating upload:', error);
      setErrorMessage('업로드 초기화 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const getPresignedUrl = async (uploadId, key, file) => {
    try {
      const response = await fetch('https://gunwoo.store/api/files/presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          uploadId: uploadId,
          partNumber: 1,
          key: key
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log("2단계");
      setUploadProgress(40);
      await uploadToS3(data, file, uploadId, key);
    } catch (error) {
      console.error('Error getting presigned URL:', error);
      setErrorMessage('프리사인 URL 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const uploadToS3 = async (url, file, uploadId, key) => {
    let eTag = null;
    console.log(file);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: file
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      eTag = response.headers.get('ETag');
      console.log("3단계");
      setUploadProgress(60);
      console.log('Upload to S3 successful');
    } catch (error) {
      console.error('Error uploading to S3:', error);
      setErrorMessage('파일 업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      if (eTag) {
        await completeUpload(uploadId, eTag, key);
      } else {
        console.error('eTag not found, upload completion skipped');
      }
    }
  };

  const completeUpload = async (uploadId, eTag, key) => {
    try {
      const response = await fetch('https://gunwoo.store/api/files/complete-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          uploadId: uploadId,
          parts: [
            {
              partNumber: 1,
              eTag: eTag
            }
          ],
          key: key
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log("4단계");
      setUploadProgress(100);
      setUploadComplete(true);
      console.log('Upload completion successful');
    } catch (error) {
      console.error('Error completing upload:', error);
      setErrorMessage('업로드 완료 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('https://gunwoo.store/api/files/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
  
      const data = response.data;
      console.log("성공");
      setImageUrls(prevUrls => [...prevUrls, data]);
      setUploadProgress(100);
      setUploadComplete(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrorMessage('이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
    if (file.type.startsWith('video/mp4')) {
      setVideo(file);
      setMediaType('video');
      setErrorMessage('');
      setIsLoading(true);
      setImageUrls(['12']);
      initiateUpload(fileNameWithoutExtension, file.type.split('/')[1], (file.size / (1024 * 1024)).toFixed(0), file);
    } else if (file.type.startsWith('image/jpeg') || file.type.startsWith('image/png')) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('이미지 파일 크기는 5MB를 초과할 수 없습니다.');
        return;
      }
      setVideo(file);
      setMediaType('image');
      setErrorMessage('');
      setIsLoading(true);

      uploadImage(file);
    } else {
      setErrorMessage('잘못된 파일 형식입니다. MP4, JPEG, PNG 형식의 파일만 업로드할 수 있습니다.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4"],
      "image/*": [".jpeg", ".jpg", ".png"],
    },
  });

  const handleCancel = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      console.log("EventSource closed");
    }
    setUploadProgress(0);
    setUploadComplete(false);
    setVideo(null);
    setDescription('');
    setTitle('');
    setMediaType(null);
    setHlsUrl('');
    setImageUrls([]);
    setIsLoading(false);
    setErrorMessage('');
  };

  const handleTitleChange = useCallback((event) => {
    const value = event.target.value;
    setTitle(value.substring(0, 20));
    setTitleCharCount(value.length > 20 ? 20 : value.length);
  }, []);

  const handleDescriptionChange = useCallback((event) => {
    const value = event.target.value;
    setDescription(value.substring(0, 30));
    setDescriptionCharCount(value.length > 30 ? 30 : value.length);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!video && imageUrls.length === 0) {
      setPopupMessage('Please upload a video or image');
      setIsPopupVisible(true);
      return;
    }

    setTitle(titleRef.current.value);
    setDescription(descriptionRef.current.value);

    console.log('Media:', video);
    console.log('Title:', titleRef.current.value);
    console.log('Description:', descriptionRef.current.value);

    try {
      const postData = {
        title: title,
        content: description,
        images: mediaType === 'image' ? imageUrls : [],
        video: mediaType === 'video' ? [hlsUrl, thumbnail] : []
      };

      const response = await axios.post(`https://gunwoo.store/api/posts/challenges/${challengeId}`, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setPopupMessage('성공적으로 게시 되었습니다');
        setIsPopupVisible(true);
        setTimeout(() => {
          navigate(`/challenge/${challenge}`);
        }, 2000);
      } else {
        throw new Error('Post creation failed');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setPopupMessage('게시물 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsPopupVisible(true);
    }
  };

  const videoPreview = useMemo(() => {
    const NextArrow = (props) => {
      const { className, onClick } = props;
      return (
        <IoIosArrowForward
          className={`${className} custom-arrow slick-next`}
          onClick={onClick}
        />
      );
    };
  
    const PrevArrow = (props) => {
      const { className, onClick } = props;
      return (
        <IoIosArrowBack
          className={`${className} custom-arrow slick-prev`}
          onClick={onClick}
        />
      );
    };
  
    const CloseButton = ({ onClick }) => {
      return (
        <IoIosClose
          style={{ color: 'white', fontSize: '30px', position: 'absolute', top: '0px', right: '10px', cursor: 'pointer' }}
          onClick={onClick}
        />
      );
    };
  
    const settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />
    };
  
    if (isLoading) {
      return (
        <div className="loading-container">
          <Skeleton height={480} width={270} />
          <div className="loading-message">
            <div className="spinner"></div>
            <p>서버에서 데이터를 불러 오고 있습니다.</p>
          </div>
        </div>
      );
    } else if (hlsUrl) {
      return (
        <video ref={videoRef} controls className="video-preview" autoPlay loop playsInline muted />
      );
    } else if (video) {
      return mediaType === 'video' ? (
        <></>
      ) : (
        <div className="carousel-container">
          <Slider {...settings}>
            {imageUrls.map((url, index) => (
              <div key={index} className="image-slide">
                <CloseButton onClick={() => handleRemoveImage(index)} />
                <img src={url} alt={`preview-${index}`} className="video-img-preview" />
              </div>
            ))}
          </Slider>
        </div>
      );
    }
    return null;
  }, [video, mediaType, hlsUrl, imageUrls, isLoading]);
  
  const handleRemoveImage = (index) => {
    setImageUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
  };

  
  if (!challengeExists) {
    return (
      <div className="none-challenge-container" style={{margin:"0 auto"}}>
        <img src={FizzLogo} alt="Fizz Logo" />
        <p>잘못된 접근이거나 존재하지 않는 챌린지입니다. </p>
        <span onClick={() => navigate(-1)}>🥺</span>
      </div>
    );
  }

  const imageInputRef = useRef(null);

  const handleAddImageClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
      if (file && file.size > 5 * 1024 * 1024) {
        setErrorMessage('파일 크기는 5MB를 초과할 수 없습니다.');
        return;
      }
      setVideo(file);
      setMediaType('image');
      setErrorMessage('');
      setIsLoading(true);

      uploadImage(file);
    } else {
      setErrorMessage('잘못된 파일 형식입니다. JPEG, PNG 형식의 파일만 업로드할 수 있습니다.');
    }
  };

  return (
    <div className="new-post-background">
      <div className="new-post-container">
        <div className="new-post-input">
          <div className="new-post-media">
            {!video && imageUrls.length === 0 ? (
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <>
                    <IoCloudUpload />
                    <p>여기에 영상을 드롭 해주세요</p>
                  </>
                ) : (
                  <>
                    <IoCloudUpload />
                    <p>업로드할 챌린지 영상 선택</p>
                    <span>또는 드래그하여 놓기</span>
                  </>
                )}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
              </div>
            ) : (
              <>
                <div className="upload-header">
                  <h2>{video ? video.name : '이미지 미리보기'}</h2>
                  <p>크기: <span>{video ? (video.size / (1024 * 1024)).toFixed(2) : '이미지 크기'} MB</span></p>
                  <p>길이: <span>{video?.duration ? `${video.duration} 초` : ''}</span></p>
                </div>
                {uploadComplete && <p className="upload-complete">완료</p>}
                {uploadProgress > 0 && (
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                )}
                <div className="media-and-description">
                  <div className='preview-container'>
                    {videoPreview}
                  </div>
                  <div className="description-input">
                    <div className="challenge-wrapper">
                      <label htmlFor="challengeName">챌린지</label>
                      <input
                        type="text"
                        id="challengeName"
                        value={newchallenge}
                        disabled
                        className='new-post-challenge'
                      />
                    </div>
                    <label htmlFor="title">제목</label>
                    <div className="title-wrapper">
                      <input
                        type="text"
                        id="title"
                        ref={titleRef}
                        value={title}
                        placeholder="챌린지의 제목을 작성해주세요."
                        className='new-post-title'
                        onChange={handleTitleChange}
                      />
                      <span className="char-post-count">{titleCharCount}/20</span>
                    </div>
                    <label htmlFor="description">설명</label>
                    <div className="description-wrapper">
                      <input
                        id="description"
                        type="text"
                        ref={descriptionRef}
                        value={description}
                        placeholder="챌린지에 대한 설명을 작성해주세요"
                        className='new-post-description'
                        onChange={handleDescriptionChange}
                      />
                      <span className="char-post-count">{descriptionCharCount}/30</span>
                    </div>
                    <div className="upload-info">
                      <div>
                        <IoInformationCircleOutline />
                        <span style={{ color: "red", fontWeight:"bold" }}>영상또는 이미지는 필수 항목입니다.</span>
                      </div>
                      <div>
                        <IoInformationCircleOutline />
                        <span style={{ color: "red", fontWeight:"bold" }}>파일 형식: 영상 파일의 필수 형식은 "mp4"입니다.</span>
                      </div>
                      <div>
                        <IoInformationCircleOutline />
                        <span>파일 크기 규격: 영상 기준 1GB 이하 - 이미지 기준 5MB 이하</span>
                      </div>
                      <div>
                        <IoInformationCircleOutline />
                        <span>가로 세로 비율: 가로의 경우 16:9, 세로의 경우 9:16이 권장됩니다.</span>
                      </div>
                      <div>
                        <IoInformationCircleOutline />
                        <span>영상과 이미지는 함께 업로드할 수 없습니다</span>
                      </div>
                      <div>
                        <IoInformationCircleOutline />
                        <span>불법 촬영 콘텐츠를 업로드하면 법률(통신사업법, 22-5조)에 따라 처벌되고 삭제될 수 있습니다</span>
                      </div>
                    </div>
                    <div className='new-post-buttons'>
                      <button
                          type="button"
                          className={mediaType === 'video' ? "add-post-video" : "add-post-image"}
                          onClick={handleAddImageClick}
                          disabled={mediaType === "video"}
                      >
                        이미지 추가
                      </button>
                      <div className='new-post-submit-buttons'>
                        <button
                          type="submit"
                          onClick={handleSubmit}
                          className={`post-submit ${!title || !description || imageUrls.length === 0 || isLoading ? 'disabled' : ''}`}
                          disabled={!title || !description || imageUrls.length === 0 || isLoading}
                        >
                          게시
                        </button>
                        <button
                          type="submit"
                          onClick={handleCancel}
                          className='post-cancel'
                        >
                          업로드 취소
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/jpg"
                  style={{ display: 'none' }}
                  ref={imageInputRef}
                  onChange={handleImageChange}
                />
              </>
            )}
            {!video && imageUrls.length === 0 && (
              <div className="upload-info">
                <div>
                  <IoInformationCircleOutline />
                  <span style={{ color: "red", fontWeight:"bold" }}>영상또는 이미지는 필수 항목입니다.</span>
                </div>
                <div>
                  <IoInformationCircleOutline />
                  <span style={{ color: "red", fontWeight:"bold" }}>파일 형식: 영상 파일의 필수 형식은 "mp4"입니다.</span>
                </div>
                <div>
                  <IoInformationCircleOutline />
                  <span>파일 크기 규격: 영상 기준 1GB 이하 - 이미지 기준 5MB 이하</span>
                </div>
                <div>
                  <IoInformationCircleOutline />
                  <span>가로 세로 비율: 가로의 경우 16:9, 세로의 경우 9:16이 권장됩니다.</span>
                </div>
                <div>
                  <IoInformationCircleOutline />
                  <span>영상과 이미지는 한번에 업로드할 수 없습니다</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isPopupVisible && (
        <NoticePopup
          setIsPopupVisible={setIsPopupVisible}
          popupStatus={[popupMessage, "#2DA7FF"]}
          buttonStatus={{ msg: "확인", action: () => setIsPopupVisible(false) }}
        />
      )}
    </div>
  );
};

export default NewPost;
