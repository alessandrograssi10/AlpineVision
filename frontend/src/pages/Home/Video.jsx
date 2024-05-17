import React from 'react';
import Alvaro from '../../assets/Video/AlvaroCheSciaComeUnVeroDuro.mp4';


export const Video = () => {
   
    return (
        <div className="Main">
            <video src={Alvaro} style={{opacity: '0.8'}} autoPlay loop muted />
                <div className="content">
                    <h2>Costruiamo l'eccellenza <br /> per ogni tua discesa.</h2>
                </div>
        </div>

    );
}