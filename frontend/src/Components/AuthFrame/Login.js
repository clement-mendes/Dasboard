import { Checkbox, TextField, Button, FormControlLabel, Typography } from "@mui/material";
import { Component, createRef } from "react";
import { login } from "../Auth/Login";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.emailRef = createRef();
        this.passwordRef = createRef();
        this.stayConnected = createRef();
    }

    async submitCallback(e) {
        e.preventDefault();
        login({
            "email": this.emailRef.current.value,
            "password": this.passwordRef.current.value,
            "stayConnected": this.stayConnected.current.checked
        })
        .then((data)=>{
            if(data !== false) {
                this.props.setUser(data);
                this.props.switchTab(this.props.TABS["Home"]);
            } else {
                // TODO : Notif erreur
                console.error("login failed");
            }
        })
        .catch((err)=>{
            console.error(err);
        })

    }

    render() { 
        return <div className="w-50 center mt-2">
            <form onSubmit={(e)=>this.submitCallback(e)} className="d-flex flex-column gap">
                <TextField inputRef={this.emailRef} id="outlined-basic" type="text" label="Email" variant="outlined" required/>
                <TextField inputRef={this.passwordRef} id="outlined-basic" type="password" label="Password" variant="outlined" required/>
                <FormControlLabel control={<Checkbox inputRef={this.stayConnected}/>} label="Stay connected" />
                <Button type="submit" variant="contained">Login</Button>
            </form>
            <Typography variant="body2">
                No account ? <a href="#" onClick={()=>this.props.switchTab(this.props.TABS["RegistrationForm"])}>Register here !</a>
            </Typography>
        </div>;
    }
}
 
export default Login;