import{ FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa'
import logo from '../assets/shashi.png'
const Navbar = () => {
  return (
    <nav className="flex items-center justify-between py-6">
        <div className="flex flex-shrink-0 items-center">
            <a href="/" araia-label="Home">
                <img src={logo} className="mx-2" width={150} height={34} alt="Logo" />
            </a>
        </div>  
        <div className="m-12 flex items-center justify-center gap-4 text4xl">
            <a href="www.linkedin.com/in/shashi-vardhan-a22358343"
                target='_blank'
                rel='noopener noreferrer'
                aria-label='LinkedIn'>
                    <FaLinkedin />
            </a>
            <a href="github.com/shashiv367"
                target='_blank'
                rel='noopener noreferrer'
                aria-label='GitHub'>
                    <FaGithub />
            </a>
            <a href="vardhans367@gmail.com"
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Gmail'>
                    <FaEnvelope />
            </a>
        </div>  
    </nav>
  )
}

export default Navbar