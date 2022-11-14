import { Component, Fragment } from "react";
import Header from './Components/Header';
import Dashboard from "./Components/Dashboard";
import RegistrationForm from "./Components/AuthFrame/RegistrationForm";


import "./css/reset.css";
import "./css/Main.css";
import "./css/rules.css";
import "./css/loadingIcon.css";
import Login from "./Components/AuthFrame/Login";
import { User } from "./Components/Auth/User";
import Notifications from "./Components/Frames/Notifications";

import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
});

const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
});

class App extends Component {
    constructor(props) {
        super(props);
        this.TABS = {
            Home:0,
            Catalog:1,
            Login: 2,
            Register: 3,
            Logout: 4
        };

        this.widgets = {

        };
        this.state = {
            user: new User(),
            userLoggedIn: false,
            currentTab: this.TABS["Home"],
            currentWidget:null,
            theme:lightTheme,
            notifData: {
                str: "",
                severity: ""
            },
            notifState: false,
        };
    }

    componentDidMount() { 
        const params = new URLSearchParams(document.location.search);

        if(params.get("user") !== undefined && params.get("user") !== null) {
            const user = params.get("user").split("::");
            
            this.setState({
                user: new User(user[0], user[1].replace(" ", "%20"), user[2].replace(" ", "%20"))
            }, ()=>{
                this.state.user.save();
                this.state.user.isLoggedIn()
                .then((res)=> {
                    if(res) {
                        this.showNotif("Heureux de vous revoir " + this.state.user.firstName + " !", "success");
                        this.setState({
                            userLoggedIn: true
                        });
                        this.switchTab(this.TABS["Home"]);
                    } else {

                    this.showNotif("Pour utiliser les fonctionnalités d'Adopte1Api, veuillez vous connecter.", "info");
                    }
                })
                .catch((err)=>{
                    this.showNotif("Pour utiliser les fonctionnalités d'Adopte1Api, veuillez vous connecter.", "info");
                    this.state.user.logout();
                });
            });
        } else {
            this.state.user.isLoggedIn()
            .then((res)=> {
                if(res) {
                    this.setState({
                        userLoggedIn: true
                    });
                    this.showNotif("Heureux de vous revoir " + this.state.user.firstName + " !", "success");
                    this.switchTab(this.TABS["Home"]);
                }
            })
            .catch((err)=>{
                this.showNotif("Pour utiliser les fonctionnalités d'Adopte1Api, veuillez vous connecter.", "info");
                console.error(err);
            });
        }
    }

    switchTab(Tab){
        this.setState({
            currentTab : Tab
        });
    }

    setUser(user) {
        user.isLoggedIn()
        .then((res)=> {
            if(res) {
                this.setState({
                    userLoggedIn: true
                });
                this.switchTab(this.TABS["Home"]);

                user.save();
            } else {
                this.setState({
                    userLoggedIn: false
                });
            }
        })
        .catch((err)=>{
            console.error(err);
        });
    }

    useDarkMode() {
        const root = document.querySelector(':root');
        root.style.setProperty("--main-bg-color", "#333");
        root.style.setProperty("--secondary-bg-color", "#444");
        root.style.setProperty("--intense-bg-color", "#222");
        root.style.setProperty("--bright-bg-color",  "#ddd");
        root.style.setProperty("--text-main-color", "#ddd");
        root.style.setProperty("--text-dark-color", "#333");
        root.style.setProperty("--bright-text-color", "#fff");
        root.style.setProperty("--line-color", "#ddd");
        document.querySelector(".logo img").style.filter = "invert(90%)";
        document.querySelector(".ft-logo img").style.filter = "invert(90%)";
    }

    useBrightMode() {
        const root = document.querySelector(':root');
        root.style.setProperty("--main-bg-color", "#DDD");
        root.style.setProperty("--secondary-bg-color", "#CCC");
        root.style.setProperty("--intense-bg-color", "#EEE");
        root.style.setProperty("--bright-bg-color",  "#333");
        root.style.setProperty("--text-main-color", "#222");
        root.style.setProperty("--text-dark-color", "#DDD");
        root.style.setProperty("--bright-text-color", "#000");
        root.style.setProperty("--line-color", "#333");
        document.querySelector(".logo img").style.filter = "invert(0%)";
        document.querySelector(".ft-logo img").style.filter = "invert(0%)";
    }


    showNotif(str, severity) {
        // Permet d'afficher une notification en bas à gauche de l'écran.
        // str est le messagfe à afficher et severity le type de message
        /*
            types de sévérité : 
                - error = rouge
                - warning = orange
                - info = bleu
                - success = vert 
        */
        this.setState({
            notifData: {
                "str": str,
                "severity": severity
            },
            notifState: true
        });
        setTimeout(()=>{
            this.setState({
                notifState: false
            });
        }, 6000);
    }



    render() {
    return <div className="App">
        <ThemeProvider theme={this.state.theme}>
        <Header setUser={(user)=>this.setUser(user)} user={this.state.user} userLoggedIn={this.state.userLoggedIn} TABS={this.TABS} switchTab={(Tab) => this.switchTab(Tab)}/>
        {
            !this.state.userLoggedIn && this.state.currentTab !== this.TABS["RegistrationForm"] ? 
                <Login setUser={(user)=>this.setUser(user)} TABS={this.TABS} switchTab={(tab)=>this.switchTab(tab)} /> 
            :
                <>{
                
                    this.state.currentTab === this.TABS["Home"] ?
                        <Dashboard showNotif={(msg, severity)=>this.showNotif(msg, severity)} />
                    : null
                }
                {
                    
                    this.state.currentTab === this.TABS["RegistrationForm"] ?
                        <RegistrationForm />
                    : null
                }</>
        }
        <Notifications
                data={this.state.notifData} 
                open={this.state.notifState}
            />
        </ThemeProvider>
    </div>
    
    }
}

export default App;