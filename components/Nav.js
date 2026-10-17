import { useEffect, useState } from "react";
import { NavLink, Link } from ".";
import { userService } from "services";
import Image from "next/image";
import { lpIsNew } from "libs/practice-version";

// ลิงก์ในหน้าต่าง How to Use ใช้ <a> ธรรมดา (โหลดหน้าใหม่) เพื่อให้หน้าต่าง Bootstrap ปิดสนิท
const DEMO_HREF = "/practice/demo";
// สไตล์แท็บในหน้าต่าง How to Use (inline เพื่อไม่ชนกับธีมเดิม)
const TABS = { display: "flex", gap: 6, padding: 4, borderRadius: 999, background: "#F4F6FD", marginBottom: 16 };
// position: relative กันกฎธีมเดิม (.navbar-expand-lg button:not(.collapsed){position:fixed} บนมือถือ) เพราะหน้าต่างนี้อยู่ใน <nav>
const TAB = { position: "relative", top: "auto", right: "auto", flex: 1, minHeight: 42, border: 0, borderRadius: 999, background: "transparent", fontWeight: 600, fontSize: 15, color: "#5E6170", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 };
const TAB_ON = { background: "#fff", color: "#2E3A8F", boxShadow: "0 6px 14px -10px rgba(31,40,112,.6)" };
const NEW_BADGE = { padding: "1px 8px", borderRadius: 999, background: "#C8202F", color: "#fff", fontSize: 11, fontWeight: 700 };
const TOUR_BTN = { display: "inline-block", padding: "10px 26px", borderRadius: 999, background: "#fff", color: "#B8336F", fontWeight: 700, textDecoration: "none" };
const GHOST_BTN = { display: "inline-block", padding: "9px 22px", borderRadius: 999, border: "2px solid #E3E6F3", color: "#2E3A8F", fontWeight: 600, textDecoration: "none" };

export function Nav() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState();
  // [Let's Practice] How to Use มี 2 แท็บ: การ์ดท่องศัพท์ (คลิปเดิม) · Let's Practice (ทัวร์ 1 นาที)
  const [howTab, setHowTab] = useState("cards");
  const [howKey, setHowKey] = useState(0); // เปลี่ยนค่า = โหลด iframe ใหม่ (หยุดคลิปเมื่อปิด)
  const [isNew, setIsNew] = useState(false); // ป้าย NEW: 30 วันนับจากวันแรกที่เครื่องนี้เห็น (ดู libs/practice-version.js)
  useEffect(() => setIsNew(lpIsNew()), []);

  useEffect(() => {
    setIsAdmin(userService.userValue?.isAdmin);
    setUser(userService.userValue);
  }, [userService.userValue]);

  // หน้าอื่นเปิด How to Use ที่แท็บที่ต้องการได้: window.dispatchEvent(new CustomEvent("wmu:howto", { detail: "lp" }))
  useEffect(() => {
    const onOpen = (e) => openHowto(e.detail === "lp" ? "lp" : "cards");
    window.addEventListener("wmu:howto", onOpen);
    return () => window.removeEventListener("wmu:howto", onOpen);
  }, []);

  function openHowto(tab) {
    setHowTab(tab);
    const $m = window.$ && window.$("#modal-video");
    if (!$m) return;
    $m.off("hidden.bs.modal.howto").on("hidden.bs.modal.howto", () => setHowKey((k) => k + 1)); // ปิดแล้วหยุดคลิป
    $m.modal("show");
  }

  const tourHref = user && !isAdmin ? "/practice?tour=1" : "/practice/demo?tour=1";

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

        <button
          className="navbar-toggler collapsed"
          type="button"
          data-toggle="collapse"
          data-target="#navbar-toggle-pills"
        >
          <span className="icon-bar top-bar"></span>
          <span className="icon-bar middle-bar"></span>
          <span className="icon-bar bottom-bar"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbar-toggle-pills">
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
                  <li className="nav-item">
                    <NavLink className="nav-link" href="/admin/practice">
                      Practice
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
                    <NavLink className="nav-link" href="/practice">
                      Let&apos;s Practice
                      {isNew && <>{" "}<span className="badge badge-pill badge-danger align-text-top">NEW</span></>}
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
                className="nav-link pl-md-[24px]"
                href="#howto"
                onClick={(e) => {
                  e.preventDefault();
                  openHowto("cards");
                }}
                style={{
                  backgroundImage: "url('/icon-video.png')",
                  backgroundSize: "24px 24px",
                  backgroundRepeat: "no-repeat",
                  backgroundPositionY: "center",
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
              <h5 className="mb-3 pr-4">How to Use · วิธีใช้ WORD ME UP</h5>
              <div role="tablist" style={TABS}>
                {[["cards", "การ์ดท่องศัพท์"], ["lp", "Let's Practice"]].map(([k, t]) => (
                  <button key={k} type="button" role="tab" aria-selected={howTab === k}
                    style={{ ...TAB, ...(howTab === k ? TAB_ON : null) }}
                    onClick={() => setHowTab(k)}>
                    {t}
                    {k === "lp" && isNew && <span style={NEW_BADGE}>ใหม่</span>}
                  </button>
                ))}
              </div>
              {howTab === "cards" ? (
                <div
                  className="embed-responsive embed-responsive-16by9 my-2 mx-auto"
                  style={{ maxWidth: 640 }}
                >
                  <iframe
                    key={howKey}
                    className="embed-responsive-item"
                    src="https://www.youtube.com/embed/kyJT_MOAro8"
                    title="วิธีใช้การ์ดท่องศัพท์ WORD ME UP"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="text-center py-2" style={{ maxWidth: 640, margin: "0 auto" }}>
                  <div className="rounded-lg p-4 mb-3 text-white" style={{ background: "linear-gradient(120deg,#8E2C5A,#D1417D)", borderRadius: 16 }}>
                    <div style={{ fontSize: 20, fontWeight: 600 }}>ให้ครูโจพาทัวร์ 1 นาที</div>
                    <div className="mb-3" style={{ fontSize: 14, opacity: 0.9 }}>กดแล้วครูโจพาชี้ทีละจุดว่าเล่นยังไง</div>
                    <a style={TOUR_BTN} href={tourHref}>
                      เริ่มทัวร์
                    </a>
                  </div>
                  <ol className="text-left mb-2" style={{ lineHeight: 1.7 }}>
                    <li>ท่องการ์ดเสร็จแล้ว กดเมนู Let&apos;s Practice</li>
                    <li>เลือกด่านจากแผนที่ ชุดละประมาณ 20 คำ 6 ด่าน ไล่จากง่ายไปยาก</li>
                    <li>อ่านวิธีเล่น แล้วกดเริ่ม ตอบแล้วเห็นเฉลยทันที ข้อที่ผิดจะวนกลับมา</li>
                    <li>เก็บดาวให้ครบ คำที่ตอบถูกจะเข้าสมุดคำศัพท์ไว้ทวน</li>
                  </ol>
                  {!user && (
                    <a style={GHOST_BTN} href={DEMO_HREF}>ลองเล่นเดโมเอง</a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
