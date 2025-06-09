import React from 'react';
import BeachGIF from '../../../../Most Used/Image/BeachGIF';
import './TotalFR.css';

function TotalFR({ totalFriends }) {
    return (
        <section className='section-total'>
            <div className='left-section-gif-fr'>
                <BeachGIF />
            </div>
            <div className='mid-section-text-fr'>
                <span>Let's invite friends!</span>
                <span className='second-span'>Total friends:</span>
            </div>
            <div className='right-section-total-fr'>
                <span className='span-count'><span className='spusk'>{totalFriends}</span></span> {/* Используем пропс totalFriends */}
            </div>
        </section>
    );
}

export default TotalFR;