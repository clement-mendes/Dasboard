import { Remove, Add, ThirtyFpsRounded, ArrowUpwardSharp, ArrowDownwardSharp, IronTwoTone, ThirtyFpsOutlined } from "@mui/icons-material";
import { List, ListItem, Typography} from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Component, Fragment } from "react";
import { backendUrl } from "../../scripts/backendUrl";


class DashboardConfig extends Component {
    constructor(props) {
        super(props);
        this.WIDGETS = [
            "Spotify",
            "AuctionHouse",
            "Meteo",
            "Love",
            "CoinMarketCap",
            "Reddit",
            "MountWidget",
            "CoinUnit",
            "WowCharacters"
        ];
        this.state = {
            widgets: this.props.widgets,
            usedWidgets: [],
            unusedWidgets: []
        };
    }

    componentDidMount() {
        let newWidgets = [];
        this.props.widgets.forEach(it=>{
            newWidgets.push(it.name);
        });

        this.setState({
            usedWidgets: [...new Set(newWidgets)],
            unusedWidgets: this.WIDGETS.filter(it=>![...new Set(newWidgets)].includes(it)),
            widgets: this.props.widgets
        });
    }

    componentDidUpdate(prevProps) {
        if(JSON.stringify(this.props.widgets) !== JSON.stringify(prevProps["widgets"]) || JSON.stringify(this.state.widgets) !== JSON.stringify(this.props.widgets) || this.props.currentConfig !== prevProps["currentConfig"] ) {
            this.componentDidMount();
        }
    }

    async removeWidget(i) {
        await fetch(backendUrl + "/api/dashboard/deleteWidget?index="+i, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        });
        let newWidgets = [];
        this.props.widgets.forEach((it, ind)=>{
            if(ind != i) {
                newWidgets.push(it);
            }
        });
        this.props.updateWidgets(newWidgets);  
    }

    addWidget(widget) {
        const data = {
            name: widget,
            width: "500px",
            height: "500px"
        }

        
        

        fetch(backendUrl + "/api/dashboard/addWidget?data="+encodeURIComponent(JSON.stringify(data)), {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }).then((res)=>{
            this.componentDidUpdate({"widgets": null});
            var newWidgets = this.props.widgets;
            data.tag = this.props.TAGS[widget];
            newWidgets.push(data);
            this.props.updateWidgets(newWidgets);
            let newWidgetNames = [];
            this.props.widgets.forEach(it=>{
                newWidgetNames.push(it.name);
            });
            this.setState({
                unusedWidgets: this.WIDGETS.filter(it=>![...new Set(newWidgetNames)].includes(it)),
            });
        }).catch((err)=>{
            console.error(err)
        });

        
    }

    async upWidget(widget) {
        let newWidgets = this.props.widgets;
        let previous, current, currentIndex;

        newWidgets.forEach((it, i)=>{
            if(it.name === widget.name) {
                current = it;
                currentIndex = i;
                previous = this.props.widgets[i - 1];
                return;
            }
        });

        newWidgets[currentIndex - 1] = current;
        newWidgets[currentIndex] = previous;

        this.props.updateWidgets(newWidgets);

        await fetch(backendUrl + "/api/dashboard/setWidgets?data="+encodeURIComponent(JSON.stringify(newWidgets)), {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        });


    }

    async downWidget(widget) {
        let newWidgets = this.props.widgets;
        let previous, current, currentIndex;

        newWidgets.forEach((it, i)=>{
            if(it.name === widget.name) {
                current = it;
                currentIndex = i;
                previous = this.props.widgets[i + 1];
                return;
            }
        });

        newWidgets[currentIndex + 1] = current;
        newWidgets[currentIndex] = previous;
        this.props.updateWidgets(newWidgets);

        await fetch(backendUrl + "/api/dashboard/setWidgets?data="+encodeURIComponent(JSON.stringify(newWidgets)), {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        });
    }

    render() { 
        return <div className="text-right widget-settings">
            <Typography variant="h6" gutterBottom sx={{fontWeight: "strong"}}>Vos widgets</Typography>
            <List>
                {
                    this.props.widgets?.map((it, i)=>
                        <ListItem key={i} sx={{fontSize:"14px", transition: "position 1s ease-out", display: "flex", justifyContent: "space-evenly"}}>
                            <span 
                                style={{cursor: "pointer"}} 
                                onClick={()=>this.props.setConfig(this.props.CONFIGS[it.name])}>{it.name}
                            </span>
                            &nbsp;&nbsp;
                            <div className="text-right" style={{marginLeft: "auto"}}>
                                {
                                    i !== 0 ?
                                        <ArrowUpwardSharp 
                                            sx={{border:"1px var(--main-bg-color) solid", cursor: "pointer"}}
                                            onClick={()=>this.upWidget(it)}
                                            /> 
                                    : null
                                }
                                { 
                                    i !== this.props.widgets?.length - 1 ?
                                    <ArrowDownwardSharp 
                                        sx={{border:"1px var(--main-bg-color) solid", cursor: "pointer"}}
                                        onClick={()=>this.downWidget(it)}
                                        />
                                    : null
                                }
                                <Remove 
                                    sx={{border:"1px var(--main-bg-color) solid", cursor: "pointer"}}
                                    onClick={()=>this.removeWidget(i)}
                                    />
                            </div>
                            
                        </ListItem>
                    )
                }
            </List>
            {
                this.state.unusedWidgets.length > 0 ?
                <Fragment>
                    <hr className = "mt-2 mb-2 w-100" />
                    <Typography variant="h6" gutterBottom  sx={{fontWeight: "strong"}}>Widgets disponibles</Typography>
                    <List sx={{fontSize:"14px"}}>
                        {
                            this.state.unusedWidgets.map((it, i)=>
                                <ListItem key={i} >
                                    <p>{it}</p> 
                                    &nbsp;&nbsp;
                                    <Add 
                                        sx={{border:"1px var(--main-bg-color) solid", marginLeft: "auto", cursor: "pointer"}}
                                        onClick={()=>this.addWidget(it)}/>
                                </ListItem>
                                ) 
                        }
                    </List>
                </Fragment> : null
            }
            
        </div>;
    }
}
 
export default DashboardConfig;