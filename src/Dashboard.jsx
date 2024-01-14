import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import { Menu, Container, Icon } from 'semantic-ui-react';
import MusicsList from './component/MusicsList';
import MusicDetails from './component/MusicDetails';
import { AuthContext } from './context/Auth.context';
import MusicPlayer from './MusicPlayer'; // Update the path accordingly

function Dashboard() {
    const { logout } = useContext(AuthContext);
    const [showMusicPlayer, setShowMusicPlayer] = useState(false);

    const onLogout = (e) => {
        e.preventDefault();
        logout();
    };
    
    const toggleMusicPlayer = () => {
        setShowMusicPlayer(!showMusicPlayer);
    };
  
    return (
        <div style={{ backgroundColor: 'black', minHeight: '100vh', color: 'white' }}>
            <Router>
                <Menu fixed='top' color='goldenrod' inverted>
                    <Menu.Menu>
                        <Menu.Item as={NavLink} to='/' exact>BeatOnCloud</Menu.Item>
                    </Menu.Menu>
                    <Menu.Menu position='right'>
                        <Menu.Item link onClick={toggleMusicPlayer}>Music Player</Menu.Item>
                        <Menu.Item link onClick={onLogout}>Log out</Menu.Item>
                    </Menu.Menu>
                </Menu>

              
                    <Route path='/' exact component={() => 
                        <MusicsList/>
                    }/>
                    <Route path='/musics/:musicId' render={props => 
                        <MusicDetails id={props.match.params.musicId} locationState={props.location.state}/>
                    }/>
              
                {showMusicPlayer && <MusicPlayer />}
            </Router>
        </div>
    );
}

export default Dashboard;
