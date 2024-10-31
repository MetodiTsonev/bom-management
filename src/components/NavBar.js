import React, {useState} from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  const [click, setClick] = useState(false);
  return (
    <>
      <nav class="navbar">
        <div class="navbar-container">
           <Link to="/" className="navbar-logo">BOM MS <i class="fab fa-typo3"></i></Link>
           <div class="menu-icon">
              <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
           </div>
        </div>
      </nav>
    </>
  )
}

export default NavBar
