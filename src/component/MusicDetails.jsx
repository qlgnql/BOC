import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import config from '../config.json';

import { BrowserRouter as Router, Route, NavLink, Link } from 'react-router-dom';

import { AuthContext } from '../context/Auth.context.jsx';


import { Container, Divider, Card, Placeholder, Button, Icon, Rating } from 'semantic-ui-react'

import MusicCardImage from './MusicCardImage'
import RecommendedMusicList from './RecommendationMusicList';

// 영화 상세 페이지
function MusicDetails({ id, locationState }) {
  const { state: ContextState, login } = useContext(AuthContext);
  const {
    isLoginPending,
    isLoggedIn,
    loginError,
    username,
    userId
  } = ContextState;
    const [music, setMusic] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [recommendedMusics, setRecommendedMusics] = React.useState([]);
    const [recommendedMusics2, setRecommendedMusics2] = React.useState([]);
    // const { state } = useContext(AuthContext);

    // config.ApiUrl need to be updated during Frontend set up lab.
    const config_api_url = config.ApiUrl;
  
    // Fetch a music data for specific music id from Music Table in DynamoDB (GET)
    const get_a_music_url = `${config_api_url}/music`
    const a_music_api = `${get_a_music_url}/${id}`
    React.useEffect(() => {
      
      async function loadDealInfo() {

        const response = await axios.get(
          a_music_api,
      );
       console.log((response.data));
       setMusic((response.data))
       setLoading(false);

        document.title = `${response.data.name} - BeatOnCloud`;
  
      };
      loadDealInfo();
  
      return () => {
        setMusic({});
        setLoading(true);
      };
    }, [id, locationState]);


    // call personalizeProcessingFunction function to make use of Amazon Personalize Campaign endpoint
    const get_realtime_recommendation = `${config_api_url}/recommendation`
    const realtime_api = `${get_realtime_recommendation}/${userId}`
    React.useEffect(() => {
      async function fetchData () {
        const response = await axios.get(
          realtime_api,);
         console.log((response.data)['musics']);
        //  console.log("state.username:",username)
         setRecommendedMusics((response.data)['musics'])
        
        
      }
      fetchData();
      

      // call batchRecommendationProcessingFunction function
      const get_batch_recommendation = `${config_api_url}/recommendation/batch`
      const batch_api = `${get_batch_recommendation}/${userId}`
      async function fetchData2 () {
        const response = await axios.get(
          batch_api,);
         console.log("batch", (response.data)['musics']);
        //  console.log("state.username:",username)
         setRecommendedMusics2((response.data)['musics'])
        
        
      }
      fetchData2();
    }, []);
  
    return (
      <Container style={{ paddingTop: 70 }}>
        <NavLink to='/'><Icon name='arrow left'/>Back to Music list</NavLink>
        <Divider hidden/>
        <Card key={music.id} style={{ width: '100%', maxWidth: 720, minHeight: 100, margin: 'auto' }}>
          {loading ? (
            <Placeholder fluid style={{minHeight: 320}}>
              <Placeholder.Image/>
            </Placeholder>
          ) : 
          (
            <MusicCardImage musicName={music.title} size = "medium" minHeight={100} fontSize={48} imageUrl={`https://beatoncloud-card-images.s3.ap-northeast-2.amazonaws.com/${music.id}.jpg`}/>
          )}
          {loading ? (
            <Placeholder>
              <Placeholder.Line/>
              <Placeholder.Line/>          
            </Placeholder>
          ) : (
            <Card.Content>
              <Card.Header>{music.title}</Card.Header>
              <Card.Description> {music.artist}</Card.Description>
              <Card.Meta>{music.genre}</Card.Meta>
            </Card.Content>
          )}
  
        </Card>
        <Divider hidden/>
        <RecommendedMusicList recommendedMusics={recommendedMusics} title = "실시간 추천 리스트"/>
        <RecommendedMusicList recommendedMusics={recommendedMusics2} title = "배치(Daily) 추천 리스트"/>
      </Container>
    );
  };
  
  MusicDetails.propTypes = {
    id: PropTypes.string,
    locationState: PropTypes.object
  };

  export default MusicDetails;