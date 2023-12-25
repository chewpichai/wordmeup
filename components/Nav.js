import { useEffect, useState } from "react";
import { NavLink, Link } from ".";
import { userService } from "services";
import Image from "next/image";

export function Nav() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    setIsAdmin(userService.userValue?.isAdmin);
    setUser(userService.userValue);
  }, [userService.userValue]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light custom-menu menu-pills">
      <div className="container">
        <Link className="navbar-brand" href="/">
          <Image
            src="/logo-wordmeup.png"
            alt="WORD ME UP"
            width="197"
            height="75"
            layout="responsive"
            priority
          />
        </Link>

        {/* <button
          className="navbar-toggler collapsed"
          type="button"
          data-toggle="collapse"
          data-target="#navbar-toggle-pills"
        >
          <span className="icon-bar top-bar"></span>
          <span className="icon-bar middle-bar"></span>
          <span className="icon-bar bottom-bar"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbar-toggle-pills"> */}
        <div>
          <ul className="navbar-nav flex-fill">
            {user ? (
              isAdmin ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" href="/admin/user">
                      User
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" href="/admin/word">
                      Word
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" href="/main">
                      Main
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" href="/completed">
                      My Completed Words
                    </NavLink>
                  </li>
                </>
              )
            ) : (
              ""
            )}
            <li className="nav-item">
              <a
                className="nav-link"
                href="#howto"
                onClick={() => $("#modal-video").modal("show")}
                style={{
                  backgroundImage: "url('/icon-video.png')",
                  backgroundSize: "36px 36px",
                  backgroundRepeat: "no-repeat",
                  backgroundPositionY: "center",
                  paddingLeft: "36px",
                }}
              >
                How to Use
              </a>
            </li>
            {user && (
              <li className="nav-item ml-lg-auto">
                <a
                  className="nav-link"
                  href="#logout"
                  onClick={userService.logout}
                >
                  Logout
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div id="modal-video" className="modal modal-video">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <button type="button" className="close" data-dismiss="modal">
                <span>&times;</span>
              </button>
              <div
                className="embed-responsive embed-responsive-16by9 my-2 mx-auto"
                style={{ maxWidth: 640 }}
              >
                <iframe
                  className="embed-responsive-item"
                  src="https://www.youtube.com/embed/kyJT_MOAro8"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
