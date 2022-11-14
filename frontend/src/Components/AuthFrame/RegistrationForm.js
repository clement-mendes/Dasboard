import { Component, createRef } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import "../../css/RegistrationForm.css";
import { backendUrl } from '../../scripts/backendUrl';

class RegistrationForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            
        };

        this.formRef = createRef();
        this.prenomRef = createRef();
        this.nomRef = createRef();
        this.mailRef = createRef();
        this.passwordRef = createRef();
    }

    async handleSubmit(e) {
        e.preventDefault();

        const data = {
            "email": this.mailRef.current.value,
            "password": this.passwordRef.current.value,
            "firstName": this.prenomRef.current.value,
            "lastName": this.nomRef.current.value
        };

        const response = await fetch(backendUrl+"/api/Auth/Register", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            mode: 'cors', // no-cors, *cors, same-origin
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });

        return await response.json();
    }

    render() { 
        return <div className="Container-form">
                    <div className='Flex'>
                        <form className="form" onSubmit={(e) => this.handleSubmit(e)} ref={this.formRef}>
                            <TextField inputRef={this.prenomRef} id="outlined-basic" type="text" label="Prénom" variant="outlined" required/>
                            <TextField inputRef={this.nomRef} id="outlined-basic" type="text" label="Nom" variant="outlined" required/>
                            <TextField inputRef={this.mailRef} id="outlined-basic" type="email" label="Mail" variant="outlined" required/>
                            <TextField inputRef={this.passwordRef} id="outlined-basic" type="password" label="Mot de passe" variant="outlined" required/>
                            <TextField id="outlined-basic" type="password" label="Confirmer mot de passe" variant="outlined" required/>
                            <Button type="submit" variant="contained">Register</Button>
                        </form>
                    </div>
                        <div  className='Flex'> ou
                        </div>
                    <div  className='Flex'>
                        <a href="https://accounts.google.com/o/oauth2/v2/auth?client_id=990236761136-d436uvvjeousdbgil3r7cs706no819h0.apps.googleusercontent.com&redirect_uri=http://localhost:8080/api/Google/OAuth&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile">
                            <Button variant="outlined" size="large"><img className="googleButton" src="./assets/googleIcon.png" alt="" />Sign in with Google</Button>
                        </a>
                    </div>
        </div>
    }       
}

export default RegistrationForm;