import { Button } from "@mui/material";
import { Component } from "react";

import "../../css/SettingsFrame.css";

class SettingsFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    
    render() { 
        return <div id="settingsFrame">
            <ul className="d-flex gap flex-column">
                <li><Button variant="contained" fullWidth >Add widget</Button></li>
                <li><Button variant="contained" fullWidth>Edit dashboard</Button></li>
                <li><Button variant="contained" color="error" fullWidth onClick={()=>this.props.logout()}>Logout</Button></li>
            </ul>
        </div>;
    }
}
 
export default SettingsFrame;