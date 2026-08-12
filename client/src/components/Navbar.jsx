import "../styles/navbar.css";
import logo from "../assets/logo.jpg"

export default function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar-container">

                <div className="navbar-brand">
                    <div className="navbar-logo">
                        <img src={logo} width={20} height={20} />
                    </div>
                   <p>|</p>
                    <span className="navbar-name">
                        HOUR OF GRACE BELIVERS MINISTRY INTERNATIONAL
                    </span>
                   <p>|</p>
            <span className="navbar-name">
                        LIGHT FELLOWSHIP
                    </span>
                </div>

            </div>
        </header>
    );
}
