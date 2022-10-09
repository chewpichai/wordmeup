import { useEffect, useState } from 'react';
import { NavLink, Link } from '.'
import { userService } from 'services'

export function Nav() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    setIsAdmin(userService.userValue?.isAdmin)
    setUser(userService.userValue)
  }, [userService.userValue])

  return (
    <nav className="navbar navbar-expand-lg navbar-light custom-menu menu-pills mb-4">
      <div className="container">
        <Link className="navbar-brand" href="/">WORD ME UP</Link>
          
        <button className={`navbar-toggler collapsed ${user ? '' : 'invisible'}`} type="button" data-toggle="collapse" data-target="#navbar-toggle-pills">
          <span className="icon-bar top-bar"></span>
          <span className="icon-bar middle-bar"></span>
          <span className="icon-bar bottom-bar"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbar-toggle-pills">
          <ul className={`navbar-nav flex-fill ${user ? '' : 'invisible'}`}>
            {isAdmin ?
            <>
              <li className="nav-item">
                <NavLink className="nav-link" href="/admin/user">User</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" href="/admin/word">Word</NavLink>
              </li>
            </>
              :
            <>
              <li className="nav-item">
                <NavLink className="nav-link" href="/main">Main</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" href="/completed">Completed</NavLink>
              </li>
            </>
            }
            <li className="nav-item ml-lg-auto">
              <a className="nav-link" href="#logout" onClick={userService.logout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
  </nav>
  )

  return (
    <nav className="navbar navbar-expand-md navbar-light custom-menu menu-pills bg-white">
      <Link className="navbar-brand" href="/">WORD ME UP</Link>
      
      <button className={`navbar-toggler ${user ? '' : 'd-none'}`} type="button" data-toggle="collapse" data-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className={`navbar-nav flex-fill ${user ? '' : 'd-none'}`}>
          <li className="nav-item">
            {isAdmin ? <NavLink className="nav-link" href="/admin/user">User</NavLink> : <NavLink className="nav-link" href="/main">Main</NavLink>}
          </li>
          <li className="nav-item">
            {isAdmin ? <NavLink className="nav-link" href="/admin/word">Word</NavLink> : <NavLink className="nav-link" href="/completed">Completed</NavLink>}
          </li>
          <li className="nav-item ml-md-auto">
            <a className="nav-link" href="#logout" onClick={userService.logout}>Logout</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}