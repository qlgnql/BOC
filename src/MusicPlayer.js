// MusicPlayer.js

import React, { useState, useRef, useEffect } from 'react';
import './MusicPlayer.css';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [selectedSong, setSelectedSong] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const albumCoverRef = useRef(null);

  const songList = [
    { title: '첫눈', file: process.env.PUBLIC_URL + '/first-snow.mp3', cover: '/image/first-snow.jpg' },
    { title: 'Stay', file: process.env.PUBLIC_URL + '/stay.mp3', cover: '/image/stay.jpg' },
    { title: '입술', file: process.env.PUBLIC_URL + '/lips.mp3', cover: '/image/lips.jpg' },
    { title: '다정히내이름을부르면', file: process.env.PUBLIC_URL + '/callmyname.mp3', cover: '/image/callmyname.jpg' },
    { title: '인사', file: process.env.PUBLIC_URL + '/hello.mp3', cover: '/image/hello.jpg' },
    { title: 'Super shy', file: process.env.PUBLIC_URL + '/supershy.mp3', cover: '/image/supershy.jpg' },
    
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
    const newSelectedSong = songList[selectedIndex];

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    setSelectedSong(newSelectedSong);
    audioRef.current.src = newSelectedSong.file;
    audioRef.current.load();

    setHasStarted(true);
  };

  const toggleLike = () => {
    if (selectedSong) {
      const isLiked = likedSongs.includes(selectedSong.title);
      if (isLiked) {
        setLikedSongs(likedSongs.filter(songTitle => songTitle !== selectedSong.title));
      } else {
        setLikedSongs([...likedSongs, selectedSong.title]);
      }
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    const progressBar = document.getElementById('progress-bar');

    setCurrentTime(audio.currentTime);

    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = progress + '%';

    if (audio.currentTime === audio.duration) {
      // 현재 재생 중인 곡이 끝났을 때 다음 곡으로 전환
      const currentIndex = songList.findIndex(song => song === selectedSong);
      const nextIndex = (currentIndex + 1) % songList.length;
      const nextSong = songList[nextIndex];

      setSelectedSong(nextSong);
      audioRef.current.src = nextSong.file;
      audioRef.current.load();
      audioRef.current.play().catch(error => console.error('Audio playback error:', error));
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

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

    if (selectedSong && !isPlaying) {
      audio.play().catch(error => console.error('Audio playback error:', error));
      setIsPlaying(true);
    }
  }, [selectedSong]);

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '235px', backgroundColor: '#F8F8FF', padding: '10px', color: '#000000' }}>
      <h3 style={{ marginBottom: '-10px' }}>
        Music Player
        <button onClick={toggleLike} style={{ marginLeft: '10px', cursor: 'pointer', fontSize: '16px', color: likedSongs.includes(selectedSong?.title) ? 'red' : 'black' }}>
          &#10084; {/* Unicode heart character */}
        </button>
      </h3>
      <div ref={albumCoverRef} className={`album-cover`}>
        {selectedSong && <img src={selectedSong.cover} alt="Album Cover" />}
      </div>
      <select onChange={handleSongChange} defaultValue="default">
        <option value="default" disabled>Select a song</option>
        {songList.map((song, index) => (
          <option key={index} value={index}>{song.title}</option>
        ))}
      </select>
      <audio ref={audioRef} src={selectedSong ? selectedSong.file : ''} />
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
        {/* Progress bar */}
        <div id="progress-bar-container" style={{ width: '100%', height: '2px', backgroundColor: '#ddd', marginTop: '-2px', position: 'relative' }}>
          <div id="progress-bar" style={{ height: '100%', backgroundColor: '#000000', width: '0%' }}></div>
        </div>
        {/* Current time / Total time */}
        {currentTime > 0 && !isNaN(audioRef.current.duration) && (
          <span>{formatTime(currentTime)} / {formatTime(audioRef.current.duration)}</span>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
