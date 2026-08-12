import "../styles/navbar.css";
import logo from "../assets/logo.jpg";

export default function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar-container">

                <div className="navbar-brand">

                    <div className="navbar-logo">
                        <img
                            src={logo}
                            alt="Hour of Grace Belivers Ministry International"
                        />
                    </div>

                    <span className="navbar-divider" />

                    <span className="navbar-name">
                        HOUR OF GRACE BELIVERS MINISTRY INTERNATIONAL
                    </span>

                    <span className="navbar-divider" />

                    <span className="navbar-name navbar-fellowship">
                        LIGHT FELLOWSHIP
                    </span>

                </div>

            </div>
        </header>
    );
}
