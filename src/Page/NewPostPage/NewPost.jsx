import React, { useState, useCallback, useRef, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import './NewPost.css';
import './PostInput.css';
import { IoCloudUpload, IoInformationCircleOutline } from "react-icons/io5";

const NewPost = () => {
  const [video, setVideo] = useState(null);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [mediaType, setMediaType] = useState(null);
  const [titleCharCount, setTitleCharCount] = useState(0);
  const [descriptionCharCount, setDescriptionCharCount] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(100);
  const [uploadComplete, setUploadComplete] = useState(true);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file.type.startsWith('video/')) {
      setVideo(file);
      setMediaType('video');
    } else if (file.type.startsWith('image/')) {
      setVideo(file);
      setMediaType('image');
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
    window.location.reload();
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

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setUploadComplete(true);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 100);
  };

  const videoPreview = useMemo(() => {
    if (video) {
      return mediaType === 'video' ? (
        <video src={URL.createObjectURL(video)} controls className="video-preview" autoPlay loop playsInline />
      ) : (
        <img src={URL.createObjectURL(video)} alt="preview" className="video-preview" />
      );
    }
    return null;
  }, [video, mediaType]);

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
                      <span className="char-count">{titleCharCount}/20</span>
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
                      <span className="char-count">{descriptionCharCount}/30</span>
                      </div>
                    <div className="upload-info">
                      <div className='upload-required'>
                        <IoInformationCircleOutline />
                        <span>영상또는 이미지는 필수 항목입니다.</span>
                        </div>
                      <div>
                        <IoInformationCircleOutline />
                        <span>최대 크기: 2GB, 동영상 길이: 10분.</span>
                      </div>
                      <div>
                        <IoInformationCircleOutline />
                        <span>파일 형식: 영상 파일의 권장 형식은 "mp4"입니다.</span>
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
              <div className='upload-required'>
                <IoInformationCircleOutline />
                <span>영상또는 이미지는 필수 항목입니다.</span>
                </div>
                <div>
                <IoInformationCircleOutline />
                <span>최대 크기: 2GB, 동영상 길이: 10분.</span>
              </div>
              <div>
                <IoInformationCircleOutline />
                <span>파일 형식: 영상 파일의 권장 형식은 "mp4"입니다.</span>
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
