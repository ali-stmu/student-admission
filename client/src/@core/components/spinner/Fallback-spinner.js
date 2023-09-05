// ** Logo
import logo from '@src/assets/images/logo/ShifaLogo.png'

const SpinnerComponent = () => {
  return (
    <div className='fallback-spinner vh-100'>
    <img className='fallback-logo' src={logo} alt='logo' style={{ height: '220px', width: '220px' }} />

      <div className='loading'>
        <div className='effect-1 effects'></div>
        <div className='effect-2 effects'></div>
        <div className='effect-3 effects'></div>
      </div>
    </div>
  )
}

export default SpinnerComponent
