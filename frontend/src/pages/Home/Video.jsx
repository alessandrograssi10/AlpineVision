import React from 'react';
import Alvaro from '../../assets/Video/AlvaroCheSciaComeUnVeroDuro.mp4';


export const Video = () => {
   
    return (
        <div className="Main">
            <video src={Alvaro} style={{opacity: '0.7'}} autoPlay loop muted />
                <div className="content">
                    <h1 className='text-style'>COSTRUIAMO L'ECCELLENZA <br /> PER OGNI TUA DISCESA.</h1>
                </div>
        </div>

    );
}