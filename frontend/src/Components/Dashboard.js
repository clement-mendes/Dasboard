import { Typography } from "@mui/material";
import { Component, Fragment, createRef } from "react";
import "../css/Dashboard.css";
import { backendUrl } from "../scripts/backendUrl";
import SpotifyWidget from "./Widgets/SpotifyWidget";
import MeteoWidget from "./Widgets/MeteoWidget";
import LoveWidget from "./Widgets/LoveWidget";
import WowWidget from "./Widgets/WowWidget";
import ControlPannel from "./ControlPanel";
import Reddit from "./Widgets/RedditWidget";
import CoinUnitWidget from "./Widgets/CoinUnitWidget";
import "../css/widget.css";
import CoinMarketCapWidget from "./Widgets/CoinMarketCapWidget";
import MountsWidget from "./Widgets/MountWidget";
import WowCharacters from "./Widgets/WowCharacters";

class Dashboard extends Component {
    constructor(props) {
        super(props);        
        
        this.CONFIGS = {
            Dashboard: "Dashboard",
            AuctionHouse: "AuctionHouse",
            MountWidget: "MountWidget",
            WowCharacters: "WowCharacters",
            Spotify: "Spotify",
            CoinMarketCap : "CoinMarketCap",
            Meteo : "Meteo",
            Reddit : "Reddit",
            CoinUnit : "CoinUnit",
            Love: "Love",
        };

        this.TAGS = {
            WowCharacters: <WowCharacters setData={(data)=>this.setData("WowCharacters", data)} getMySize={()=>this.getWidgetSize("WowCharacters")}  showNotif={(msg, severity)=>this.props.showNotif(msg, severity)} ></WowCharacters>,
            Love: <LoveWidget setData={(data)=>this.setData("Love", data)} getMySize={()=>this.getWidgetSize("Love")} showNotif={(msg, severity)=>this.props.showNotif(msg, severity)}></LoveWidget>,
            Meteo: <MeteoWidget setData={(data)=>this.setData("Meteo", data)} getMySize={()=>this.getWidgetSize("Meteo")} showNotif={(msg, severity)=>this.props.showNotif(msg, severity)}></MeteoWidget>,
            Spotify: <SpotifyWidget setData={(data)=>this.setData("Spotify", data)} getMySize={()=>this.getWidgetSize("Spotify")} showNotif={(msg, severity)=>this.props.showNotif(msg, severity)}></SpotifyWidget>,
            AuctionHouse: <WowWidget setData={(data)=>this.setData("AuctionHouse", data)} getMySize={()=>this.getWidgetSize("AuctionHouse")} showNotif={(msg, severity)=>this.props.showNotif(msg, severity)}></WowWidget>,
            CoinMarketCap: <CoinMarketCapWidget setData={(data)=>this.setData("CoinMarketCap", data)} getMySize={()=>this.getWidgetSize("CoinMarketCap")} showNotif={(msg, severity)=>this.props.showNotif(msg, severity)}></CoinMarketCapWidget>,
            MountWidget: <MountsWidget setData={(data)=>this.setData("MountWidget", data)} getMySize={()=>this.getWidgetSize("MountWidget")} showNotif={(msg, severity)=>this.props.showNotif(msg, severity)}></MountsWidget>,
            Reddit: <Reddit setData={(data)=>this.setData("Reddit", data)} getMySize={()=>this.getWidgetSize("Reddit")} showNotif={(msg, severity)=>this.props.showNotif(msg, severity)}></Reddit>,
            CoinUnit: <CoinUnitWidget setData={(data)=>this.setData("CoinUnit", data)} getMySize={()=>this.getWidgetSize("CoinUnit")} showNotif={(msg, severity)=>this.props.showNotif(msg, severity)}></CoinUnitWidget>
        };

        this.state = {
            
            widgets : [],
            widgetSizes: {},
            widgetDatas : {},
            currentConfig: this.CONFIGS["Dashboard"],
            currentData: "",
            controlPanelCollapsed: false
        };

        this.dashboardRef = createRef();
    }

    getWidgetSize(widget) {
        if(this.state.widgetSize !== undefined && this.state.widgetSize !== null) {
            return this.state.widgetSizes[widget];
        } 

        return {
            width: undefined,
            height: undefined
        }
    }

    componentDidMount() {
        this.getWidgets();
    }

    updateWidgets(newWidgets) {
        this.setState({
            widgets: newWidgets
        });
    }
    
    setConfig(widget) {
        this.setState({
            currentConfig: widget,
            currentData: widget
        });
        
    }

    setData(widget, data) {
        this.state.widgetDatas[widget] = data;
        this.setState({});
    }

    async getWidgets() {
        const response = await fetch(backendUrl + "/api/dashboard/getWidgets", {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                'Content-Type': 'application/json'
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            });

        response.json().then((data)=>{
            if(data.widgets === null || data.widgets === "null") {
                return;
            }
            let widgets = [];
            JSON.parse(data.widgets).map(it=>{
                let widgetObject = it;
                
                switch(it.name) {
                    case "Spotify":
                        widgetObject.tag = this.TAGS["Spotify"];
                        break;
                    case "AuctionHouse":
                        widgetObject.tag = this.TAGS["AuctionHouse"];
                        break;
                    case "CoinMarketCap":
                        widgetObject.tag = this.TAGS["CoinMarketCap"];
                        break;
                    case "MountWidget":
                        widgetObject.tag = this.TAGS["MountWidget"];
                        break;
                    case "Reddit":
                        widgetObject.tag = this.TAGS["Reddit"];
                        break;
                    case "Meteo":
                        widgetObject.tag = this.TAGS["Meteo"];
                        break;
                    case "CoinUnit":
                        widgetObject.tag = this.TAGS["CoinUnit"];
                        break;
                    case "Love":
                        widgetObject.tag = this.TAGS["Love"];
                        break;
                    case "WowCharacters":
                        widgetObject.tag = this.TAGS["WowCharacters"];
                        break;
                    default:
                        break;
                }
                this.state.widgetSizes[it.name] = {
                    width: it.width,
                    height: it.height
                };
                this.setState({});


                widgets.push(widgetObject);

            });
            this.setState({
                widgets: widgets
            });
        });
    }
    setControlPannelCollapsed() {
        const dashboard = this.dashboardRef.current;

        if(this.state.controlPanelCollapsed) {
            
            dashboard.style.width = "calc(100vw - 300px)";
            dashboard.style.marginLeft = "300px";
        } else {

            dashboard.style.width = "calc(100vw - 20px)";
            dashboard.style.marginLeft = "20px";
        }
        this.setState({
            controlPanelCollapsed: !this.state.controlPanelCollapsed
        });
        
    }
    render() { 
        return <Fragment>
            <ControlPannel 
                updateWidgets={(newWidgets)=>this.updateWidgets(newWidgets)} 
                currentConfig={this.state.currentConfig} 
                CONFIGS={this.CONFIGS} 
                widgets={this.state.widgets} 
                setConfig={(config)=>this.setConfig(config)} 
                data={this.state.widgetDatas[this.state.currentData]}
                setCollapsed={()=>this.setControlPannelCollapsed()}
                TAGS={this.TAGS}
                showNotif={(msg, severity)=>this.props.showNotif(msg, severity)} />
            <div className="dashboard p-2 gap" id="dashboard" ref={this.dashboardRef}>
            {
                !this.state.widgets.length ? 
                    <div>
                        <Typography variant="body2">Ajoutez des widgets à votre dashboard.</Typography>
                    </div>
                    :
                    this.state.widgets.map((it, i)=>it.tag)
            }
            </div>
        </Fragment>;
    }
}
 
export default Dashboard;