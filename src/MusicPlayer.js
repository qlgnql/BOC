//Music Player 최종본 (좋아요 표시 사라짐)

import React, { useState, useRef, useEffect } from 'react';
import './MusicPlayer.css';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const albumCoverRef = useRef(null);

  const songList = [
    { title: 'The Kid LAROI, Justin Bieber - Stay', file: process.env.PUBLIC_URL + '/stay.mp3', cover: '/image/stay.jpg' },
    { title: 'EXO - 첫눈', file: process.env.PUBLIC_URL + '/first-snow.mp3', cover: '/image/first-snow.jpg' },
    { title: '헤이즈(Feat.10CM) - 입술', file: process.env.PUBLIC_URL + '/lips.mp3', cover: '/image/lips.jpg' },
    { title: '경서예지 X 전건호 - 다정히 내 이름을 부르면', file: process.env.PUBLIC_URL + '/callmyname.mp3', cover: '/image/callmyname.jpg' },
    { title: '범진 - 인사', file: process.env.PUBLIC_URL + '/hello.mp3', cover: '/image/hello.jpg' },
    { title: 'NEWJEANS - Super shy', file: process.env.PUBLIC_URL + '/supershy.mp3', cover: '/image/supershy.jpg' },
    { title: '부석순 - 파이팅 해야지', file: process.env.PUBLIC_URL + '/fighting.mp3', cover: '/image/fighting.jpg' },
    // ... (이전 코드는 그대로 유지)
  ];

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const togglePlay = () => {
    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => console.error('Audio playback error:', error));
    }

    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const handleSongChange = (e) => {
    const selectedIndex = e.target.value;
    const newSelectedIndex = parseInt(selectedIndex, 10);

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    setCurrentSongIndex(newSelectedIndex);
    setHasStarted(true);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    const progressBar = document.getElementById('progress-bar');

    setCurrentTime(audio.currentTime);

    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = progress + '%';
  };

  const handleSongEnded = () => {
    playNextSong();
  };

  const playNextSong = () => {
    const nextIndex = (currentSongIndex + 1) % songList.length;

    setCurrentSongIndex(nextIndex);

    const selectElement = document.getElementById('song-select');
    selectElement.value = nextIndex.toString();

    audioRef.current.src = songList[nextIndex].file;
    audioRef.current.load();
    audioRef.current.play().catch(error => console.error('Audio playback error:', error));
    setIsPlaying(true);
  };

  useEffect(() => {
    const audio = audioRef.current;

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleSongEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleSongEnded);
    };
  }, [currentSongIndex, hasStarted]);

  useEffect(() => {
    const albumCover = albumCoverRef.current;
    albumCover.classList.toggle('spin', isPlaying && hasStarted);
  }, [isPlaying, hasStarted]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;

    if (currentSongIndex !== null && !isPlaying) {
      audio.play().catch(error => console.error('Audio playback error:', error));
      setIsPlaying(true);
    }
  }, [currentSongIndex]);

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '240px', backgroundColor: '#F8F8FF', padding: '10px', color: '#000000' }}>
      <h3 style={{ marginBottom: '10px' }}>
        Music Player
      </h3>
      <div ref={albumCoverRef} className={`album-cover`}>
        {songList[currentSongIndex] && <img src={songList[currentSongIndex].cover} alt="Album Cover" />}
      </div>
      <select id="song-select" onChange={handleSongChange} defaultValue="default">
        <option value="default" disabled>Select a song</option>
        {songList.map((song, index) => (
          <option key={index} value={index}>{song.title}</option>
        ))}
      </select>
      <audio ref={audioRef} src={songList[currentSongIndex] ? songList[currentSongIndex].file : ''} />
      <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={handleVolumeChange}
      />
      <div>
        <div id="progress-bar-container" style={{ width: '100%', height: '2px', backgroundColor: '#ddd', marginTop: '-2px', position: 'relative' }}>
          <div id="progress-bar" style={{ height: '100%', backgroundColor: '#000000', width: '0%' }}></div>
        </div>
        {currentTime > 0 && !isNaN(audioRef.current.duration) && (
          <span>{formatTime(currentTime)} / {formatTime(audioRef.current.duration)}</span>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
