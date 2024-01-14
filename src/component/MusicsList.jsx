import React from 'react';
import axios from 'axios';
import config from '../config.json';


import { Container } from 'semantic-ui-react'

import MusicsListCardGroup from './MusicsListCardGroup';

function MusicsList() {
    const [musics, setMusics] = React.useState([]);
    // const [musics, setMusics] = React.useState([]);

    // Fetch all music data from Music Table in DynamoDB (GET)
    // config.ApiUrl need to be updated during Frontend set up lab.
    const config_api_url = config.ApiUrl;
    const get_music_url = `${config_api_url}/music`
    React.useEffect(() => {
      async function fetchData () {
        const response = await axios.get(
          get_music_url,);
        //  console.log((response.data)['musics']);
        //  setMusics((response.data)['musics'])
        //  console.log(config.ApiUrl)
         console.log((response.data));
         setMusics((response.data))
        
        
      }
      fetchData();
    }, []);
    
  
    document.title = 'BeatOncloud';
    return (
      <Container style={{ paddingTop: 70 }}>
        <MusicsListCardGroup items={musics} pageViewOrigin='Browse'/>
      </Container>
    );
  };

  export default MusicsList;