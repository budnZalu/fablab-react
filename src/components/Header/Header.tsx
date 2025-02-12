import React from "react";
import { Link } from "react-router-dom";
import './Header.css';
import { Navbar, Nav } from "react-bootstrap";

const Header: React.FC = () => {
    return (
        <Navbar expand="lg" className="header">
            <Navbar.Brand as={Link} to="/" className="header-title-link">
                <h2 className="title">FabLab Moscow</h2>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
                <Nav className="ms-auto">
                    <Nav.Link as={Link} to="/jobs" className="header-link">
                        Работы
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>


    );
};

export default Header;
