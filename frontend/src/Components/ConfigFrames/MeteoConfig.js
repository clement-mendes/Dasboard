import { Component, createRef } from "react";
import { Button, TextField, Typography} from "@mui/material";

class MeteoConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.cityRef = createRef();
    }
    
    render() { 
        return <div className="widget-settings">
                    <Typography variant="h4" gutterBottom>Meteo</Typography>
                    <TextField 
                        label="Entrez votre ville" 
                        variant="outlined" 
                        inputRef={this.cityRef}
                        fullWidth
                        
                    />
                    <Button onClick={()=>this.props.data.setCity(this.cityRef.current.value)} >
                        Submit
                    </Button>
                </div>
    }
}
 
export default MeteoConfig;