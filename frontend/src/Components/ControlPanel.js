import { Component, Fragment } from "react";
import "../css/ControlPannel.css";
import AuctionHouseConfig from "./ConfigFrames/AuctionHouseConfig";
import DashboardConfig from "./ConfigFrames/DashboardConfig";
import CoinMarketCapConfig from "./ConfigFrames/CoinMarketCapConfig";
import MeteoConfig from "./ConfigFrames/MeteoConfig";
import LoveConfig from "./ConfigFrames/LoveConfig";
import CoinUnitConfig from "./ConfigFrames/CoinUnitConfig";
import HomeIcon from '@mui/icons-material/Home';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { Link, Breadcrumbs } from "@mui/material";
import { ChargingStationSharp } from "@mui/icons-material";
import WowCharactersConfig from "./ConfigFrames/WowCharactersConfig";

class ControlPannel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCollapsed: false,
        };
    }

    setIsCollapsed(){
        this.setState({
            isCollapsed:!this.state.isCollapsed
        });
        this.props.setCollapsed();
    }

    render() { 
        return (
            <div className="control-panel float-left pl-2 pt-2 pb-2" 
                style={{
                    width: this.state.isCollapsed ? "20px" : "325px",
                    minWidth: this.state.isCollapsed ? "20px" : "325px"
                }}>
                
                <div 
                    onClick={()=>this.setIsCollapsed()} 
                    style={{
                        width: "20px",
                        float: "right",
                        height: "100vh",
                        cursor: "pointer",
                        borderRadius: "100%"
                    }}></div> 
                {
                    this.state.isCollapsed ? null :<Fragment>
                        <Breadcrumbs aria-label="breadcrumb" style={{
                            width: "calc(100% - 20px)",
                            float: "left",
                        }}>
                            <Link
                                underline="hover"
                                sx={{ display: 'flex', alignItems: 'center', cursor: "pointer" }}
                                color="inherit"
                                onClick={()=>this.props.setConfig(this.props.CONFIGS["Dashboard"])}
                            >
                                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                                Dashboard
                            </Link>
                            {
                                this.props.currentConfig !== this.props.CONFIGS["Dashboard"] ? 
                                    <Link
                                    underline="hover"
                                    sx={{ display: 'flex', alignItems: 'center' }}
                                    color="inherit"
                                    >
                                        <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                                        {this.props.currentConfig}
                                    </Link> 
                                    : null
                            }
                        </Breadcrumbs>
                        <hr className = "mt-2 mb-2" style={{
                            width: "calc(100% - 20px)", 

                            float: "left"
                        }}/>
                    
                        {
                            this.props.currentConfig === this.props.CONFIGS["Dashboard"] ?
                                <DashboardConfig 
                                    currentConfig={this.props.currentConfig} 
                                    widgets={this.props.widgets} 
                                    updateWidgets={(newWidget)=>this.props.updateWidgets(newWidget)} 
                                    setConfig={(config)=>this.props.setConfig(config)} 
                                    CONFIGS={this.props.CONFIGS} 
                                    data={this.props.data} 
                                    TAGS={this.props.TAGS} />
                            :

                            <>
                                {this.props.currentConfig === this.props.CONFIGS["AuctionHouse"] ?
                                <AuctionHouseConfig data={this.props.data} />
                                : null}
                                {this.props.currentConfig === this.props.CONFIGS["CoinMarketCap"] ?
                                <CoinMarketCapConfig data={this.props.data}></CoinMarketCapConfig>
                                : null}
                                 {this.props.currentConfig === this.props.CONFIGS["Meteo"] ?
                                <MeteoConfig data={this.props.data}></MeteoConfig>
                                : null}
                                {this.props.currentConfig === this.props.CONFIGS["CoinUnit"] ?
                                <CoinUnitConfig data={this.props.data}></CoinUnitConfig>
                                : null}
                                {this.props.currentConfig === this.props.CONFIGS["Love"] ?
                                <LoveConfig data={this.props.data}></LoveConfig>
                                : null}
                                {this.props.currentConfig === this.props.CONFIGS["WowCharacters"] ?
                                <WowCharactersConfig data={this.props.data}></WowCharactersConfig>
                                : null}
                            </>
                        }
                    </Fragment>
                }
            </div>
        )
    }
}
 
export default ControlPannel;