import './Wallet.css'
import { useState, useEffect } from 'react'
import TonButton from './Ton-connect-button/TonButton'
import Menu from '../../Most Used/Menu/Menu'

const tg = window.Telegram.WebApp

const UserProfileWallet = () => {
  const [userName, setUserName] = useState('')
  const [userPhoto, setUserPhoto] = useState('')
  const [userId, setUserId] = useState('')
  const [userUsername, setUserUsername] = useState('')

  useEffect(() => {
    if (tg) {
      const user = tg.initDataUnsafe.user
      if (user) {
        const name = user.first_name || ''
        const photo = user.photo_url || ''
        const id = user.id || ''
        const username = user.username ? `@${user.username}` : ''

        setUserName(name)
        setUserPhoto(photo)
        setUserId(id)
        setUserUsername(username)

        localStorage.setItem('userName', name)
        localStorage.setItem('userPhoto', photo)
        localStorage.setItem('userId', id)
        localStorage.setItem('userUsername', username)
      }
    } else {
      // Восстановление из localStorage
      const storedUserName = localStorage.getItem('userName')
      const storedUserPhoto = localStorage.getItem('userPhoto')
      const storedUserId = localStorage.getItem('userId')
      const storedUserUsername = localStorage.getItem('userUsername')
      if (storedUserName) setUserName(storedUserName)
      if (storedUserPhoto) setUserPhoto(storedUserPhoto)
      if (storedUserId) setUserId(storedUserId)
      if (storedUserUsername) setUserUsername(storedUserUsername)
    }
  }, [])

  return (
    <div className="user-profile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '340px', height: 'auto', padding: '10px' }}>
      {userPhoto ? (
        <img src={userPhoto} alt="User Avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '10px' }} />
      ) : (
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#ccc', marginBottom: '10px' }} />
      )}
      <div style={{ textAlign: 'center' }}>
        {userName ? (
          <>
            <h2 className='UserNameTG' style={{ margin: 0, fontSize: '20px' }}>{userName}</h2>
            {userUsername ? (
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
  )
}

function Wallet() {

  return (
    <section className='bodywalletpage'>
      <div className='content-section'>
        <UserProfileWallet />
        <TonButton />
      </div>
      <Menu />
    </section>
  )
}

export default Wallet;