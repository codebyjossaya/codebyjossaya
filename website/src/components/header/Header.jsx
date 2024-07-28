import React from 'react';
import './Header.css';
const Header = ({ links }) => {
    return (
        <div className="header" id="navbar" style={{width: "100%", position:"sticky", height: "0px", top: "0", right: "0wv", textAlign: "right"}}>
            <div style={{padding: "35px"}}>
                {links.map((link) => {
                return (
                    <a style={{padding: "10px"}} href={link[Object.keys(link)[0]]} key={link.key}>{Object.keys(link)[0]}</a>
                )
                })}
            </div>
        </div>
    );
};

export default Header;