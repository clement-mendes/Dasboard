import { Component } from "react";
import { Snackbar, Alert } from "@mui/material";

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() { 
        return <Snackbar open={this.props.open} autoHideDuration={6000}>
            <Alert severity={this.props.data.severity} sx={{ width: '100%' }}>
                {this.props.data.str}
            </Alert>
        </Snackbar>;
    }
}
 
export default Notifications;