import React, { useEffect, useState } from 'react';
import './TotalFR.css';
import BeachGIFFr from '../img-jsx-fr/BeachGIFFr';

function TotalFR({ totalFriends }) {
    const [friendsCount, setFriendsCount] = useState(totalFriends || 0);

    useEffect(() => {
        setFriendsCount(totalFriends || 0);
    }, [totalFriends]);

    return (
        <section className='section-total'>
            <div className='left-section-gif-fr'>
                <BeachGIFFr />
            </div>
            <div className='mid-section-text-fr'>
                <span>Let's invite friends!</span>
                <span className='second-span'>Total friends:</span>
            </div>
            <div className='right-section-total-fr'>
                <span className='span-count'>{friendsCount}</span>
            </div>
        </section>
    );
}

export default TotalFR;