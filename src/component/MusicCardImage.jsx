import React from 'react';
import PropTypes from 'prop-types';

import { Image, Segment } from 'semantic-ui-react'

function MusicCardImage({musicName, minHeight, fontSize, imageUrl}) {
  
  
    return (
      <Segment style={{minHeight, display: 'flex'}}>
        <Image centered src={ imageUrl }  />
      </Segment>
    );
  }
  
  MusicCardImage.propTypes = {
    dealName: PropTypes.string,
    minHeight: PropTypes.number,
    fontSize: PropTypes.number,
    imageUrl: PropTypes.string
  };

  export default MusicCardImage;