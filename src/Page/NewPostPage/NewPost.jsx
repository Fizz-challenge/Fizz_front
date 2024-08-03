import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { EventSourcePolyfill } from 'event-source-polyfill';
import Hls from 'hls.js';
import './NewPost.css';
import './PostInput.css';
import { IoCloudUpload, IoInformationCircleOutline } from 'react-icons/io5';

const NewPost = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const videoRef = useRef(null);
  const eventSourceRef = useRef(null);

  const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBQ0NFU1NfVE9LRU4iLCJ1c2VySWQiOiIyNCIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MjI2ODQ0OTUsImV4cCI6MTcyMjY4NjI5NX0.ZVx8DCdWyhSWlybioRnSjY-CtuM5IRTUkegieZAyFy1bJvvpqzWen9sHs2fMRUR9yJbWJS344cX4_FvUGCIrNA';

  const subscribeToNotifications = useCallback(() => {
    const eventSource = new EventSourcePolyfill('https://gunwoo.store/api/notify/subscribe', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    eventSource.onopen = () => {
      console.log("EventSource connected");
    };

    eventSource.addEventListener("file-encoding-event", async (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        console.log("Received message:", parsedData);

        if (parsedData.type === "ENCODING_FINISH") {
          setUploadProgress(100);
          setIsLoading(false);
          setHlsUrl(parsedData.videoUrl);
        }
        else {
          alert("문제 발생!");
        }

      } catch (error) {
        console.error("Failed to parse event data:", error);
      }
    });

    eventSource.onerror = function (error) {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    eventSourceRef.current = eventSource;
  }, [token]);

  useEffect(() => {
    subscribeToNotifications();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [subscribeToNotifications]);

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
      setUploadComplete(true);
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
      setUploadProgress(80);
      console.log('Upload completion successful');
    } catch (error) {
      console.error('Error completing upload:', error);
      setErrorMessage('업로드 완료 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
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

      // 파일 정보 받아오기
      initiateUpload(fileNameWithoutExtension, file.type.split('/')[1], (file.size / (1024 * 1024)).toFixed(0), file);
    } else if (file.type.startsWith('image/jpeg') || file.type.startsWith('image/png')) {
      setVideo(file);
      setMediaType('image');
      setErrorMessage('');
      setIsLoading(true);

      // 파일 정보 받아오기
      initiateUpload(fileNameWithoutExtension, file.type.split('/')[1], (file.size / (1024 * 1024)).toFixed(0), file);
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
    }
    setUploadProgress(0);
    setUploadComplete(false);
    setVideo(null);
    setDescription('');
    setTitle('');
    setMediaType(null);
    setHlsUrl('');
    setIsLoading(false);
    setErrorMessage('');

    // 구독을 재개
    subscribeToNotifications();
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
    if (!video) {
      alert('Please upload a video or image');
      return;
    }

    setTitle(titleRef.current.value);
    setDescription(descriptionRef.current.value);

    console.log('Media:', video);
    console.log('Title:', titleRef.current.value);
    console.log('Description:', descriptionRef.current.value);

    setUploadProgress(0);
    setUploadComplete(false);

    initiateUpload(titleRef.current.value, video.type.split('/')[1], (video.size / (1024 * 1024)).toFixed(0), video);
  };

  const videoPreview = useMemo(() => {
    if (isLoading) {
      return <p>로딩 중...</p>;
    } else if (hlsUrl) {
      return (
        <video ref={videoRef} controls className="video-preview" autoPlay loop playsInline />
      );
    } else if (video) {
      return mediaType === 'video' ? (
        <video src={URL.createObjectURL(video)} controls className="video-preview" autoPlay loop playsInline />
      ) : (
        <img src={URL.createObjectURL(video)} alt="preview" className="video-preview" />
      );
    }
    return null;
  }, [video, mediaType, hlsUrl, isLoading]);

  return (
    <div className="new-post-background">
      <div className="new-post-container">
        <div className="new-post-input">
          <div className="new-post-media">
            {!video ? (
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
                  <h2>{video.name}</h2>
                  <p>크기: <span>{(video.size / (1024 * 1024)).toFixed(2)} MB</span></p>
                  <p>길이: <span>{video.duration ? `${video.duration} 초` : ''}</span></p>
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
                        <span>최대 크기: 1GB, 동영상 길이: 10분.</span>
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
                        <span>Fizz!에 동영상을 제출하면 Fizz! 커뮤니티 가이드라인에 동의함을 인정하는 것입니다.</span>
                      </div>
                      <div>
                        <IoInformationCircleOutline />
                        <span>불법 촬영 콘텐츠를 업로드하면 법률(통신사업법, 22-5조)에 따라 처벌되고 삭제될 수 있습니다</span>
                      </div>
                    </div>
                    <div className='new-post-buttons'>
                      <button
                        type="submit"
                        className={mediaType === 'video' ? "add-post-video" : "add-post-image"}
                        onClick={handleSubmit}
                        disabled={mediaType === 'video'}
                      >
                        이미지 추가
                      </button>
                      <div className='new-post-submit-buttons'>
                        <button
                          type="submit"
                          onClick={handleSubmit}
                          className='post-submit'
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
              </>
            )}
            {!video && (
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
                  <span>최대 크기: 2GB, 동영상 길이: 10분.</span>
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
    </div>
  );
};

export default NewPost;
