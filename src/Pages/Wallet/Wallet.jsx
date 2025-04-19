import './Wallet.css'
import { useState, useEffect } from 'react';
import TonButton from './Ton-connect-button/TonButton';
import Menu from '../../Most Used/Menu/Menu';
import Coin from '../../Most Used/Image/Coin';


const tg = window.Telegram.WebApp;

const UserProfileWallet = () => {
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const [userId, setUserId] = useState('');
  const [userUsername, setUserUsername] = useState(''); // Добавляем состояние для имени пользователя

  useEffect(() => {
    if (tg) {
      const user = tg.initDataUnsafe.user;
      if (user) {
        const name = user.first_name || '';
        const photo = user.photo_url || '';
        const id = user.id || '';
        const username = user.username ? `@${user.username}` : ''; // Получаем имя пользователя

        setUserName(name);
        setUserPhoto(photo);
        setUserId(id);
        setUserUsername(username); // Устанавливаем имя пользователя

        localStorage.setItem('userName', name);
        localStorage.setItem('userPhoto', photo);
        localStorage.setItem('userId', id);
        localStorage.setItem('userUsername', username); // Сохраняем имя пользователя в localStorage
      }
    } else {
      const storedUserName = localStorage.getItem('userName');
      const storedUserPhoto = localStorage.getItem('userPhoto');
      const storedUserId = localStorage.getItem('userId');
      const storedUserUsername = localStorage.getItem('userUsername'); // Получаем имя пользователя из localStorage
      if (storedUserName) setUserName(storedUserName);
      if (storedUserPhoto) setUserPhoto(storedUserPhoto);
      if (storedUserId) setUserId(storedUserId);
      if (storedUserUsername) setUserUsername(storedUserUsername); // Устанавливаем имя пользователя
    }
  }, []);

  return (
    <div className="user-profile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '340px', height: 'auto', padding: '10px' }}>
      {userPhoto ? (
        <img
          src={userPhoto}
          alt="User Avatar"
          style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '10px' }}
        />
      ) : (
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#ccc', marginBottom: '10px' }} />
      )}
      <div style={{ textAlign: 'center' }}>
        {userName ? (
          <>
            <h2 className='UserNameTG' style={{ margin: 0, fontSize: '20px' }}>{userName}</h2>
            {userUsername ? ( // Отображаем имя пользователя, если оно существует
              <p style={{ margin: 0, fontSize: '17px', color: '#b9bbbc' }}>{userUsername}</p>
            ) : (
              <p style={{ margin: 0, fontSize: '17px', color: '#b9bbbc' }}>Telegram Name</p>
            )}
          </>
        ) : (
          <h2 style={{ margin: 0 }}>Loading...</h2>
        )}
      </div>
    </div>
  );
};



function Wallet() {

  return(
    <section className='bodywalletpage'>
      <div className='margin-div-wallet'></div>
      <div className='content-section'>
        <UserProfileWallet />
        <TonButton />
      </div>
      <div className='info-user'>
        <span className='bold-text'>Points</span>
        <section className='points-container'>
          <article className='left-section-points-wl'>
            <Coin />
          </article>
          <article className='middle-section-points-wl'>
            <span>BTS</span>
            <span className='points-kolvo'>54.321</span>
          </article>
        </section>
      </div>
      <div className='info-user-boosters'>
        <span className='bold-text'>Your Collection</span>
      </div>
      <Menu />
    </section>
  );
}

export default Wallet;