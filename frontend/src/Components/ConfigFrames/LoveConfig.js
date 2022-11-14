import { Component, createRef } from "react";
import { Button, TextField, Typography} from "@mui/material";

class MeteoConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.snameRef = createRef();
        this.fnameRef = createRef();
    }
    
    render() { 
        return <div className="widget-settings d-flex flex-column gap">
                    <Typography variant="h4" gutterBottom>Love Calculator</Typography>
                    <TextField 
                        label="Entrez votre nom" 
                        variant="outlined" 
                        inputRef={this.snameRef}
                        fullWidth
                        
                    />
                     <TextField 
                        label="Entrez le nom de votre amour" 
                        variant="outlined" 
                        inputRef={this.fnameRef}
                        fullWidth
                        
                    />
                    <Button onClick={()=>this.props.data.setName(this.snameRef.current.value, this.fnameRef.current.value)} >
                        Calculate
                    </Button>
                </div>
    }
}
 
export default MeteoConfig;