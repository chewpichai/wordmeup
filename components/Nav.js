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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <Link className="navbar-brand" href="/">WORD ME UP</Link>
      {user &&
        <>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav flex-fill">
            <li className="nav-item">
              {isAdmin ? <NavLink className="nav-link" href="/admin/user">User</NavLink> : <NavLink className="nav-link" href="/main">Main</NavLink>}
            </li>
            <li className="nav-item">
              {isAdmin ? <NavLink className="nav-link" href="/admin/word">Word</NavLink> : <NavLink className="nav-link" href="/completed">Completed</NavLink>}
            </li>
            <li className="nav-item ml-lg-auto">
              <a className="nav-link" href="#logout" onClick={userService.logout}>Logout</a>
            </li>
          </ul>
        </div>
        </>
      }
    </nav>
  )
}