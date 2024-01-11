import React, {useContext} from 'react';
// import { AuthContext } from '../context/Auth.context';
import PropTypes from 'prop-types';

import { BrowserRouter as Router, Route, NavLink, Link } from 'react-router-dom';

import { Card, Rating, Icon } from 'semantic-ui-react'

import MusicCardImage from './MusicCardImage'

import { useTracking } from 'react-tracking';
import { dispatchUserEvent } from '../util/Utils';





function MusicsListCardGroup({ items, pageViewOrigin, cardStyle }) {
    // console.log(items)

    // const { state: ContextState } = useContext(AuthContext);
    // const {userId} = ContextState;

    const { Track, trackEvent } = useTracking({page: 'MusicListCardPage'}, {
      dispatch: (data) => dispatchUserEvent(data)
    });
  

    function musicCards() {
      return items
        .map(music =>
          <Card
            key={music.id}
            as={Link} to={{ pathname: `/musics/${music.id}`, state:  {pageViewOrigin}  }}
            style={cardStyle}
            onClick={() => { trackEvent({ EVENT_TYPE: 'click', musicId: `${music.id}` }); }}
            >
  
            <MusicCardImage musicName={music.title} size = "small" minHeight={140} fontSize={24} imageUrl={`https://beatoncloud-card-images.s3.ap-northeast-2.amazonaws.com/${music.id}.jpg`}
            />
            <Card.Content>
              <Card.Header>{music.title}</Card.Header>
              <Card.Description>{music.artist}</Card.Description>
              <Card.Meta>{music.genre}</Card.Meta>
            </Card.Content>
            <Card.Content extra>
                {music.score? <>Score: <strong>{music.score}</strong></> : <Card.Meta >{music.score}</Card.Meta>}
            </Card.Content>
          </Card>
        );
    };
  
    return (
      <Track>
      <Card.Group centered>
        {musicCards()}
      </Card.Group>
      </Track>
    );
  };
  
  MusicsListCardGroup.propTypes = {
    items: PropTypes.array,
    pageViewOrigin: PropTypes.string,
    cardStyle: PropTypes.object
  };

  export default MusicsListCardGroup;