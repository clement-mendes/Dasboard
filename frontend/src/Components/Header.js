import { Avatar, useTheme } from '@mui/material';
import { Component, Fragment } from 'react';
import { Box, IconButton, Typography} from "@mui/material";

import "../css/Header.css";
import { logout } from './Auth/Logout';
import { User } from './Auth/User';

import InputBase from "@mui/material/InputBase";

import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SettingsFrame from './Frames/Settings';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSettings: false
        };
    }

    avatarCallback() {
        if(this.props.userLoggedIn) {
            logout(this.props.user)
            .then((res)=>{

                this.props.setUser(new User());
            })
            .catch((err)=>{
                console.error(err);
            });
        } else {
            this.props.switchTab(this.props.TABS["Login"]);
        }
    }

    showSettings() {
        this.setState({
            showSettings: !this.state.showSettings
        });
    }

    render() { 
        return (
            <Fragment>
                
                <Box 
                sx = {{marginLeft:"20vw", width:"80vw"}}
                display="flex" 
                justifyContent="space-between" 
                p={2}>
                {/* SEARCH BAR*/}
                    <Box 
                    display="flex"
                    borderRadius="3px"
                    >
        
                    <InputBase sx={{ ml: 2, flex:1}} placeholder="Search" />
                        <IconButton type="button" sx={{p : 1}}>
                            <SearchOutlinedIcon />
                        </IconButton>
                    </Box>
        
                    {/* ICONS */}
                    <Box display="flex">
                        {/* <IconButton onClick={colorMode.toggleColorMode}>
                            {theme.palette.mode === "dark" ? (
                                <DarkModeOutlinedIcon />
                            ) : (
                                <LightModeOutlinedIcon />
                            )}
                        </IconButton> */ null} 
                        <IconButton>
                            <NotificationsOutlinedIcon />
                        </IconButton>
                        <IconButton>
                            <SettingsOutlinedIcon onClick={()=>this.showSettings()}/>
                        </IconButton>
                        <IconButton>
                            <PersonOutlineOutlinedIcon onClick={()=>this.avatarCallback()} 
                                sx={{
                                    cursor: "pointer",
                                    marginLeft: "auto",
                                    borderRadius: "100%",
                                    padding: "0.05em",
                                    backgroundColor: this.props.userLoggedIn ? "var(--text-success)" : "var(--text-danger)"

                                }}/>
                        </IconButton>
                    </Box>
                </Box>
                {
                    this.state.showSettings ? 
                        <SettingsFrame logout={()=>this.avatarCallback()}/>
                        : null
                }
            </Fragment>
        );
    }
}
 
export default Header;