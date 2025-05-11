import { textAlign } from '@mui/system';
import * as React from 'react';
import { ThreeDots } from "react-loader-spinner";
import '../style.css';

export default function OverlayLoader({
    showLoader
}) {
    return (
        <div id="overlay" style={{
            display: showLoader ? 'flex' : 'none'
            
        }}>
            <div className='loaderWrapper'>
                <ThreeDots 
                    height="100" 
                    width="100" 
                    radius="9"
                    color="#4fa94d" 
                    ariaLabel="three-dots-loading"
                    // wrapperStyle={{}}
                    // wrapperClassName=""
                    visible={true}
                />   
            </div>
        </div>
    )
}

