import { useEffect, useRef, useState, type ReactNode } from "react";

type Screen = "home" | "cases" | "camera" | "problems" | "detail" | "community" | "more";
type CameraStage = "ready" | "analyzing";
type CameraPurpose = "case" | "sos";
type IconName =
  | "home"
  | "book"
  | "chat"
  | "more"
  | "alert"
  | "search"
  | "camera"
  | "mic"
  | "edit"
  | "bath"
  | "boiler"
  | "water"
  | "washer"
  | "bulb"
  | "fridge"
  | "bug"
  | "mold"
  | "trash"
  | "arrow"
  | "back"
  | "clock"
  | "people"
  | "tool"
  | "check"
  | "pin"
  | "phone"
  | "close"
  | "shield"
  | "chevron"
  | "bell"
  | "heart"
  | "bookmark";

const categories = [
  { name: "화장실", icon: "bath" as IconName, tone: "blue" },
  { name: "보일러", icon: "boiler" as IconName, tone: "orange" },
  { name: "수도·수질", icon: "water" as IconName, tone: "cyan" },
  { name: "세탁기", icon: "washer" as IconName, tone: "lavender" },
  { name: "전기·조명", icon: "bulb" as IconName, tone: "yellow" },
  { name: "냉장고", icon: "fridge" as IconName, tone: "mint" },
  { name: "해충", icon: "bug" as IconName, tone: "rose" },
  { name: "곰팡이", icon: "mold" as IconName, tone: "green" },
  { name: "쓰레기", icon: "trash" as IconName, tone: "gray" },
];

const problems = [
  {
    name: "욕실 배수구에서 냄새가 나요",
    count: 128,
    desc: "물 사용 후에도 냄새가 계속 올라오는 경우",
    meta: "약 15분 · 직접 해결 가능",
    icon: "water" as IconName,
    tone: "cyan",
  },
  {
    name: "변기가 자주 막혀요",
    count: 93,
    desc: "물이 천천히 내려가거나 수위가 차오르는 경우",
    meta: "약 20분 · 도구 필요",
    icon: "bath" as IconName,
    tone: "blue",
  },
  {
    name: "샤워기에서 물이 새요",
    count: 71,
    desc: "잠가도 헤드나 연결부에서 물이 떨어지는 경우",
    meta: "약 10분 · 직접 해결 가능",
    icon: "water" as IconName,
    tone: "lavender",
  },
  {
    name: "세면대 물이 잘 안 내려가요",
    count: 56,
    desc: "배수가 느리고 물이 잠시 고이는 경우",
    meta: "약 20분 · 장갑 필요",
    icon: "tool" as IconName,
    tone: "green",
  },
];

const steps = [
  {
    label: "확인",
    title: "배수구 덮개를 열어 상태를 확인해요",
    body: "고무장갑을 끼고 덮개 주변의 머리카락과 이물질이 보이는지 확인하세요. 악취가 심하면 먼저 환풍기를 켜 주세요.",
  },
  {
    label: "조치",
    title: "보이는 이물질을 천천히 제거해요",
    body: "집게나 사용하지 않는 칫솔로 이물질을 꺼낸 뒤 봉투에 바로 담아 주세요. 배관 안쪽으로 밀어 넣지 않는 것이 중요해요.",
  },
  {
    label: "확인",
    title: "미지근한 물을 흘려보내요",
    body: "약 30초 동안 물을 흘려보낸 뒤 10분 후 냄새가 줄었는지 확인하세요. 그대로라면 트랩 문제일 수 있어요.",
  },
  {
    label: "다음 행동",
    title: "냄새가 계속되면 집주인에게 알려요",
    body: "사진과 함께 냄새가 시작된 시점, 직접 해 본 조치를 전달하면 더 빠르게 상황을 파악할 수 있어요.",
  },
];

function Icon({
  name,
  strokeWidth = 1.8,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth,
  };
  const paths: Record<IconName, ReactNode> = {
    home: <><path {...common} d="M3 11.5 12 4l9 7.5" /><path {...common} d="M5.5 10.5V21h13V10.5M9.5 21v-6h5v6" /></>,
    book: <><path {...common} d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22Z" /><path {...common} d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22Z" /></>,
    chat: <><path {...common} d="M21 11.5a8.5 8.5 0 0 1-9 8.5 10 10 0 0 1-3.4-.6L4 21l1.3-4A8.5 8.5 0 1 1 21 11.5Z" /><path {...common} d="M8 12h.01M12 12h.01M16 12h.01" /></>,
    more: <><circle {...common} cx="5" cy="12" r="1" /><circle {...common} cx="12" cy="12" r="1" /><circle {...common} cx="19" cy="12" r="1" /></>,
    alert: <><path {...common} d="M12 3 2.8 19a1.4 1.4 0 0 0 1.2 2h16a1.4 1.4 0 0 0 1.2-2Z" /><path {...common} d="M12 9v5M12 17.5v.1" /></>,
    search: <><circle {...common} cx="11" cy="11" r="7" /><path {...common} d="m20 20-4-4" /></>,
    camera: <><path {...common} d="M4 7h3l1.5-2h7L17 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" /><circle {...common} cx="12" cy="13" r="4" /></>,
    mic: <><rect {...common} x="8" y="3" width="8" height="13" rx="4" /><path {...common} d="M5 12a7 7 0 0 0 14 0M12 19v3" /></>,
    edit: <><path {...common} d="m4 16-1 5 5-1L20 8l-4-4Z" /><path {...common} d="m14 6 4 4" /></>,
    bath: <><path {...common} d="M4 12h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z" /><path {...common} d="M6 12V7a3 3 0 0 1 6 0v1M7 20v2M17 20v2" /></>,
    boiler: <><rect {...common} x="5" y="2" width="14" height="18" rx="3" /><circle {...common} cx="12" cy="8" r="2" /><path {...common} d="M9 20v2M15 20v2M9 14h6" /></>,
    water: <path {...common} d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z" />,
    washer: <><rect {...common} x="4" y="2" width="16" height="20" rx="2" /><circle {...common} cx="12" cy="14" r="5" /><path {...common} d="M7 6h.01M11 6h5" /></>,
    bulb: <><path {...common} d="M9 18h6M10 22h4M8.5 15.5A7 7 0 1 1 15.5 15.5L15 18H9Z" /></>,
    fridge: <><rect {...common} x="6" y="2" width="12" height="20" rx="2" /><path {...common} d="M6 10h12M9 6v2M9 13v3" /></>,
    bug: <><ellipse {...common} cx="12" cy="13" rx="5" ry="7" /><path {...common} d="M9 6 7 3M15 6l2-3M7 10H3M7 15H3M17 10h4M17 15h4M12 6v14" /></>,
    mold: <><path {...common} d="M12 2.5 15 6l4.5.5-.7 4.5 2.7 3.5-3.8 2.4-.9 4.4-4.3-1.5-4 2.1-2-4.1-4.4-1.2 1-4.4L1 8.2 5.2 6.5 7 2.3l4.2 1.6Z" /><circle {...common} cx="9" cy="11" r=".7" /><circle {...common} cx="15" cy="14" r=".7" /></>,
    trash: <><path {...common} d="M4 7h16M9 3h6l1 4H8ZM6 7l1 15h10l1-15M10 11v7M14 11v7" /></>,
    arrow: <><path {...common} d="M5 12h14M14 7l5 5-5 5" /></>,
    back: <path {...common} d="m15 19-7-7 7-7" />,
    clock: <><circle {...common} cx="12" cy="12" r="9" /><path {...common} d="M12 7v5l3 2" /></>,
    people: <><circle {...common} cx="9" cy="9" r="3" /><path {...common} d="M3 20a6 6 0 0 1 12 0M16 6a3 3 0 0 1 0 6M17 15a5 5 0 0 1 4 5" /></>,
    tool: <path {...common} d="M14.7 6.3a5 5 0 0 0-6.8 6.8L3 18l3 3 4.9-4.9a5 5 0 0 0 6.8-6.8l-3 3-3-3Z" />,
    check: <path {...common} d="m5 12 4 4L19 6" />,
    pin: <><path {...common} d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle {...common} cx="12" cy="10" r="2.5" /></>,
    phone: <path {...common} d="M7 3H4a2 2 0 0 0-2 2 17 17 0 0 0 17 17 2 2 0 0 0 2-2v-3l-5-1-1.5 3a14 14 0 0 1-9.5-9.5L8 8Z" />,
    close: <path {...common} d="m6 6 12 12M18 6 6 18" />,
    shield: <><path {...common} d="M12 2 4 5v6c0 5 3.4 9 8 11 4.6-2 8-6 8-11V5Z" /><path {...common} d="m8.5 12 2.2 2.2 4.8-5" /></>,
    chevron: <path {...common} d="m9 18 6-6-6-6" />,
    bell: <><path {...common} d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" /><path {...common} d="M10 21h4" /></>,
    heart: <path {...common} d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    bookmark: <path {...common} d="M6 3h12a1 1 0 0 1 1 1v18l-7-4-7 4V4a1 1 0 0 1 1-1Z" />,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" width={24} height={24}>{paths[name]}</svg>;
}

function Header({ title, onBack, action }: { title: string; onBack?: () => void; action?: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = Math.max(window.scrollY, 0);

      if (currentScrollY <= 46) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`top-header ${isVisible ? "header-visible" : "header-hidden"}`}>
      <div className="header-side">
        {onBack && <button className="icon-button" onClick={onBack} aria-label="뒤로 가기"><Icon name="back" /></button>}
      </div>
      <div className="header-title">{title}</div>
      <div className="header-side right">{action}</div>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedProblem, setSelectedProblem] = useState(problems[0]);
  const [openStep, setOpenStep] = useState(0);
  const [sosOpen, setSosOpen] = useState(false);
  const [sosStep, setSosStep] = useState(0);
  const [messageOpen, setMessageOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [cameraStage, setCameraStage] = useState<CameraStage>("ready");
  const [cameraPurpose, setCameraPurpose] = useState<CameraPurpose>("case");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const history = useRef<Screen[]>([]);
  const cameraTimer = useRef<number | null>(null);

  const navigate = (next: Screen) => {
    if (next === screen) return;
    history.current.push(screen);
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goBack = () => {
    const previous = history.current.pop() ?? "home";
    if (previous === "camera") setCameraStage("ready");
    setScreen(previous);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const currentTab =
    screen === "problems" || screen === "detail" ? "cases" : screen;

  return (
    <div className="app-stage">
      <main className="phone-shell">
        <div className="status-bar"><span>9:41</span><span className="status-icons">● ◒ ▰</span></div>
        <div className={`content ${screen === "camera" ? "camera-content" : ""}`}>
          {screen === "home" && <Home onCases={() => navigate("cases")} onProblem={() => navigate("detail")} onCommunity={() => navigate("community")} onSos={() => setSosOpen(true)} />}
          {screen === "cases" && <Cases onCategory={() => navigate("problems")} onCamera={() => { setCameraPurpose("case"); setCameraStage("ready"); navigate("camera"); }} />}
          {screen === "camera" && (
            <CameraRecognition
              stage={cameraStage}
              onBack={() => {
                if (cameraTimer.current !== null) {
                  window.clearTimeout(cameraTimer.current);
                  cameraTimer.current = null;
                }
                if (cameraPurpose === "sos") {
                  const previous = history.current.pop() ?? "home";
                  setScreen(previous);
                  setSosStep(0);
                  setSosOpen(true);
                  window.scrollTo({ top: 0 });
                } else {
                  goBack();
                }
              }}
              onCapture={() => {
                setCameraStage("analyzing");
                cameraTimer.current = window.setTimeout(() => {
                  cameraTimer.current = null;
                  if (cameraPurpose === "sos") {
                    const previous = history.current.pop() ?? "home";
                    setScreen(previous);
                    setSosStep(1);
                    setSosOpen(true);
                    window.scrollTo({ top: 0 });
                  } else {
                    setSelectedProblem(problems[0]);
                    setOpenStep(0);
                    navigate("detail");
                  }
                }, 1800);
              }}
            />
          )}
          {screen === "problems" && (
            <Problems
              onBack={() => navigate("cases")}
              onSelect={(problem) => {
                setSelectedProblem(problem);
                setOpenStep(0);
                navigate("detail");
              }}
            />
          )}
          {screen === "detail" && (
            <Detail
              problem={selectedProblem}
              openStep={openStep}
              setOpenStep={setOpenStep}
              onBack={goBack}
              onClose={() => navigate("cases")}
              isBookmarked={isBookmarked}
              onBookmark={() => {
                setIsBookmarked((saved) => !saved);
                flash(isBookmarked ? "스크랩에서 삭제했어요" : "해결 사례를 스크랩했어요");
              }}
              onMessage={() => setMessageOpen(true)}
              onVendor={() => flash("상도동 근처 수리 업체를 찾고 있어요")}
            />
          )}
          {screen === "community" && <Community />}
          {screen === "more" && <More />}
        </div>
        {screen !== "camera" && <BottomNav current={currentTab} onNavigate={navigate} onSos={() => setSosOpen(true)} />}
        {toast && <div className="toast"><Icon name="check" size={18} />{toast}</div>}
        {sosOpen && (
          <SosFlow
            step={sosStep}
            setStep={setSosStep}
            onCamera={() => {
              setSosOpen(false);
              setCameraPurpose("sos");
              setCameraStage("ready");
              navigate("camera");
            }}
            onClose={() => { setSosOpen(false); setSosStep(0); }}
            onMessage={() => { setSosOpen(false); setMessageOpen(true); }}
          />
        )}
        {messageOpen && <MessageSheet onClose={() => setMessageOpen(false)} onSend={() => { setMessageOpen(false); flash("메시지 앱으로 초안을 보냈어요"); }} />}
      </main>
    </div>
  );
}

function Home({ onCases, onProblem, onCommunity, onSos }: { onCases: () => void; onProblem: () => void; onCommunity: () => void; onSos: () => void }) {
  return (
    <div className="page home-page">
      <div className="home-top">
        <div>
          <div className="display-title">서윤님의<br /><span>생활 해결 책장</span></div>
        </div>
        <button className="notification-button" aria-label="알림"><Icon name="bell" /></button>
      </div>

      <button className="home-urgent-card" onClick={onSos}>
        <span className="urgent-symbol"><Icon name="shield" size={24} /></span>
        <span>
          <strong>긴급한 문제인가요?</strong>
          <small>지금 먼저 할 일을 빠르게 알려드려요</small>
        </span>
        <Icon name="chevron" size={24} />
      </button>

      <section className="home-library">
        <div className="library-top">
          <strong>해결 사례 책장</strong>
          <button onClick={onCases}>전체 보기</button>
        </div>
        <div className="shelf-section">
          <div className="shelf-label"><span>욕실과 물</span></div>
          <div className="book-row">
            <button className="case-book book-blue" onClick={onProblem}>
              <img src="https://images.unsplash.com/photo-1668910227848-8b604673e051?auto=format&fit=crop&w=500&q=80" alt="욕실 세면대와 배수구" />
              <strong>배수구<br />냄새 없애기</strong>
            </button>
            <button className="case-book book-cream" onClick={onProblem}>
              <img src="https://images.unsplash.com/photo-1587527893189-8ed2d3edd54b?auto=format&fit=crop&w=500&q=80" alt="화장실 변기" />
              <strong>막힌 변기<br />차근히 해결하기</strong>
            </button>
            <button className="case-book book-coral" onClick={onProblem}>
              <img src="https://images.unsplash.com/photo-1587527901949-ab0341697c1e?auto=format&fit=crop&w=500&q=80" alt="욕실 샤워 공간" />
              <strong>샤워기<br />누수 체크</strong>
            </button>
            <button className="case-book book-navy" onClick={onCases}>
              <img src="https://images.unsplash.com/photo-1739176566047-d9573b6c9fac?auto=format&fit=crop&w=500&q=80" alt="수도꼭지와 배관" />
              <strong>수도 문제<br />모아보기</strong>
            </button>
          </div>
          <div className="wood-shelf"><i /></div>
        </div>
        <div className="shelf-section second-shelf">
          <div className="shelf-label"><span>주방과 생활</span></div>
          <div className="book-row">
            <button className="case-book book-green" onClick={onCases}>
              <img src="https://images.unsplash.com/photo-1642497590009-a163903de133?auto=format&fit=crop&w=500&q=80" alt="냉장고가 있는 주방" />
              <strong>냉장고<br />이상 신호</strong>
            </button>
            <button className="case-book book-yellow" onClick={onCases}>
              <img src="https://images.unsplash.com/photo-1737737180662-b3664e1741fd?auto=format&fit=crop&w=500&q=80" alt="조명이 켜진 주방" />
              <strong>전기와 조명<br />기초 가이드</strong>
            </button>
            <button className="case-book book-purple" onClick={onCases}>
              <img src="https://images.unsplash.com/photo-1628843226223-989e20810393?auto=format&fit=crop&w=500&q=80" alt="드럼 세탁기" />
              <strong>세탁기<br />셀프 점검</strong>
            </button>
            <button className="case-book book-orange" onClick={onCases}>
              <img src="https://images.unsplash.com/photo-1580401410158-1f0b0a406762?auto=format&fit=crop&w=500&q=80" alt="집 수리에 사용하는 공구" />
              <strong>보일러<br />따뜻한 겨울</strong>
            </button>
          </div>
          <div className="wood-shelf"><i /></div>
        </div>
      </section>

      <section className="home-community">
        <div className="home-section-title">
          <strong>커뮤니티 인기글 <span>2</span></strong>
          <button onClick={onCommunity}>전체 보기</button>
        </div>
        <div className="popular-post-row">
          <button className="popular-post" onClick={onCommunity}>
            <span className="post-tag">곰팡이</span>
            <span className="post-main">
              <span className="post-copy">
                <strong>창가 곰팡이, 다시 안 생기게 관리한 방법</strong>
                <span>아침마다 10분씩 환기했더니 확실히 달라졌어요. 제가 해본 순서도 같이 정리해뒀어요.</span>
              </span>
              <span className="post-thumbnail thumbnail-green"><Icon name="mold" size={28} /></span>
            </span>
            <span className="post-meta"><span><Icon name="heart" size={18} />38</span><span><Icon name="chat" size={18} />12</span><time>2일 전</time></span>
          </button>
          <button className="popular-post" onClick={onCommunity}>
            <span className="post-tag tag-orange">보일러</span>
            <span className="post-main">
              <span className="post-copy">
                <strong>보일러 압력이 자꾸 떨어질 때 확인한 것</strong>
                <span>기사님을 부르기 전에 밸브 주변부터 확인했어요. 같은 상황이라면 참고해보세요.</span>
              </span>
              <span className="post-thumbnail thumbnail-orange"><Icon name="boiler" size={28} /></span>
            </span>
            <span className="post-meta"><span><Icon name="heart" size={18} />24</span><span><Icon name="chat" size={18} />8</span><time>4일 전</time></span>
          </button>
        </div>
      </section>
    </div>
  );
}

function Cases({ onCategory, onCamera }: { onCategory: () => void; onCamera: () => void }) {
  const inputOptions = [
    { icon: "camera" as IconName, label: "카메라", tone: "blue" },
    { icon: "mic" as IconName, label: "말로 설명", tone: "lavender" },
    { icon: "edit" as IconName, label: "직접 입력", tone: "mint" },
  ];
  return (
    <div className="page cases-page">
      <Header title="문제별 사례" action={<button className="icon-button"><Icon name="search" /></button>} />
      <div className="intro-block">
        <div className="eyebrow accent">생활 문제 해결 도서관</div>
        <div className="page-title cases-title">어떤 문제를 겪고 있나요?</div>
        <p>지금 상황과 가장 가까운 방법으로 시작해보세요.</p>
      </div>
      <div className="input-methods">
        {inputOptions.map((item) => (
          <button className={`input-method method-${item.tone}`} key={item.label} onClick={() => item.label === "카메라" ? onCamera() : undefined}>
            <span className={`method-icon tone-${item.tone}`}><Icon name={item.icon} /></span>
            <strong>{item.label}</strong>
          </button>
        ))}
      </div>
      <div className="section-heading compact"><div><span>카테고리</span><small>문제가 생긴 곳을 선택해주세요</small></div></div>
      <div className="category-grid">
        {categories.map((category) => (
          <button key={category.name} className="category-card" onClick={onCategory}>
            <span className={`category-icon tone-${category.tone}`}><Icon name={category.icon} size={25} /></span>
            <strong>{category.name}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

function CameraRecognition({
  stage,
  onBack,
  onCapture,
}: {
  stage: CameraStage;
  onBack: () => void;
  onCapture: () => void;
}) {
  return (
    <div className={`camera-page camera-${stage}`}>
      <div className="camera-top">
        <button onClick={onBack} aria-label="카메라 닫기"><Icon name="close" /></button>
        <strong>카메라로 문제 찾기</strong>
        <span />
      </div>

      <div className="camera-viewfinder">
        <img
          src="https://images.unsplash.com/photo-1668910227848-8b604673e051?auto=format&fit=crop&w=900&q=85"
          alt="카메라 화면에 보이는 욕실 세면대와 배수구"
        />
        <div className="camera-shade" />
        <div className="focus-frame"><i /><i /><i /><i /></div>
        {stage === "ready" && <div className="camera-guide">문제가 보이도록 가까이 촬영해주세요</div>}
        {stage === "analyzing" && (
          <div className="analysis-overlay">
            <div className="scan-line" />
            <span className="analysis-spinner" />
            <strong>사진을 분석하고 있어요</strong>
            <small>배수구와 주변 상태를 확인 중이에요</small>
          </div>
        )}
      </div>

      {stage === "ready" && (
        <div className="camera-controls">
          <button className="gallery-button" aria-label="사진 보관함"><Icon name="camera" /></button>
          <button className="shutter-button" onClick={onCapture} aria-label="사진 촬영"><span /></button>
          <button className="camera-help" aria-label="촬영 도움말">?</button>
        </div>
      )}

      {stage === "analyzing" && (
        <div className="analyzing-copy">
          <strong>잠시만 기다려주세요</strong>
          <span>인식이 끝나면 해결 사례로 바로 이동해요.</span>
        </div>
      )}
    </div>
  );
}

function Problems({ onBack, onSelect }: { onBack: () => void; onSelect: (problem: typeof problems[0]) => void }) {
  return (
    <div className="page problems-page">
      <Header title="화장실" onBack={onBack} action={<button className="icon-button"><Icon name="search" /></button>} />
      <div className="intro-block list-intro">
        <div className="eyebrow accent">화장실 · 4개의 주요 문제</div>
        <div className="page-title">지금 상황과 가장<br />가까운 문제는 무엇인가요?</div>
        <p>비슷한 문제를 해결한 사람들의 순서를 알려드려요.</p>
      </div>
      <div className="filter-row">
        <button className="filter active">전체</button>
        <button className="filter">냄새</button>
        <button className="filter">배수</button>
        <button className="filter">누수</button>
      </div>
      <div className="problem-list">
        {problems.map((problem) => (
          <button className="problem-card" key={problem.name} onClick={() => onSelect(problem)}>
            <span className="problem-copy">
              <strong>{problem.name}</strong>
              <span>{problem.desc}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="help-note"><Icon name="chat" /><span><strong>내 문제와 조금 다른가요?</strong><small>사진이나 말로 지금 상황을 알려주세요.</small></span></div>
    </div>
  );
}

function Detail({
  problem,
  openStep,
  setOpenStep,
  onBack,
  onClose,
  isBookmarked,
  onBookmark,
  onMessage,
  onVendor,
}: {
  problem: typeof problems[0];
  openStep: number;
  setOpenStep: (step: number) => void;
  onBack: () => void;
  onClose: () => void;
  isBookmarked: boolean;
  onBookmark: () => void;
  onMessage: () => void;
  onVendor: () => void;
}) {
  return (
    <div className="page detail-page">
      <Header
        title="해결 사례"
        onBack={onBack}
        action={
          <div className="detail-header-actions">
            <button className={`icon-button ${isBookmarked ? "bookmarked" : ""}`} onClick={onBookmark} aria-label="스크랩">
              <Icon name="bookmark" />
            </button>
            <button className="icon-button" onClick={onClose} aria-label="닫기">
              <Icon name="close" />
            </button>
          </div>
        }
      />
      <div className="detail-hero">
        <div className="detail-caption"><span>{problem.count}명이 이 문제를 해결했어요</span></div>
        <div className="detail-title">{problem.name}</div>
        <p>대부분 배수구 주변 이물질이나 마른 트랩이 원인이었어요.</p>
        <div className="fact-row">
          <div><Icon name="clock" /><span><small>예상 시간</small><strong>15–20분</strong></span></div>
          <div className="easy-fact"><Icon name="tool" /><span><small>난이도</small><strong>쉬워요</strong></span></div>
          <div><Icon name="shield" /><span><small>해결 방식</small><strong>직접 해결</strong></span></div>
        </div>
      </div>
      <div className="section-heading steps-heading">
        <div><span>이 순서대로 해보세요</span><small>단계를 눌러 자세히 확인할 수 있어요</small></div>
        <div className="step-count">{openStep + 1} / {steps.length}</div>
      </div>
      <div className="timeline">
        {steps.map((step, index) => {
          const isOpen = openStep === index;
          return (
            <div className={`timeline-item ${isOpen ? "open" : ""}`} key={step.title}>
              <div className="timeline-rail"><span>{index + 1}</span>{index < steps.length - 1 && <i />}</div>
              <button className="step-card" onClick={() => setOpenStep(index)} aria-expanded={isOpen}>
                <span className="step-label">{step.label}</span>
                <strong>{step.title}</strong>
                <div className="step-details" aria-hidden={!isOpen}>
                  <div className="step-details-inner">
                    <p>{step.body}</p>
                    {index === 0 && (
                      <div className="supply-row"><span>준비물</span><b>고무장갑</b><b>작은 집게</b><b>봉투</b></div>
                    )}
                  </div>
                </div>
                {index !== 0 && <span className="step-chevron"><Icon name="chevron" size={17} /></span>}
              </button>
            </div>
          );
        })}
      </div>
      <div className="community-section">
        <div className="section-heading compact"><div><span>비슷한 상황의 이야기</span><small>직접 해결한 자취생의 경험이에요</small></div><button>더 보기</button></div>
        <article className="community-card">
          <div className="community-top"><span className="mini-avatar">민</span><span><strong>민지***</strong><small>자취 8개월 · 3일 전</small></span></div>
          <p>저도 청소를 해도 계속 냄새가 났는데, 트랩에 물이 말라 있었어요. 물을 두 컵 정도 부어두니 다음 날부터 괜찮아졌어요.</p>
          <div className="tag-row"><span>#욕실냄새</span><span>#배수구</span><span>#직접해결</span></div>
          <div className="community-stats"><span>도움돼요 24</span><span>댓글 6</span></div>
        </article>
      </div>
      <div className="detail-actions">
        <button className="secondary-cta" onClick={onVendor}>근처 수리 업체 찾기</button>
        <button className="primary-cta" onClick={onMessage}>집주인에게 메시지</button>
      </div>
    </div>
  );
}

function Community() {
  const cards = [
    { avatar: "유", name: "유진***", time: "2시간 전", title: "보일러 압력이 자꾸 떨어질 때 확인한 것", body: "수리 기사님을 부르기 전에 밸브 주변부터 사진으로 확인했어요. 같은 상황이라면 이 순서가 도움이 될 거예요.", tags: ["#보일러", "#수리후기"] },
    { avatar: "도", name: "도현***", time: "어제", title: "창가 곰팡이, 다시 생기지 않게 관리한 방법", body: "한 번 닦는 것보다 아침마다 10분씩 환기하는 게 확실히 효과가 있었어요.", tags: ["#곰팡이", "#자취팁"] },
  ];
  return (
    <div className="page community-page">
      <Header title="커뮤니티" action={<button className="icon-button"><Icon name="search" /></button>} />
      <div className="intro-block community-intro">
        <div className="eyebrow accent">혼자 고민하지 않아도 돼요</div>
        <div className="page-title">먼저 겪어본 사람들의<br />생활 해결 노트</div>
      </div>
      <div className="filter-row">
        <button className="filter active">추천</button><button className="filter">누수</button><button className="filter">곰팡이</button><button className="filter">꿀팁</button>
      </div>
      <div className="feed-list">
        {cards.map((card) => (
          <article className="feed-card" key={card.title}>
            <div className="community-top"><span className="mini-avatar">{card.avatar}</span><span><strong>{card.name}</strong><small>자취 1년 · {card.time}</small></span></div>
            <div className="feed-title">{card.title}</div>
            <p>{card.body}</p>
            <div className="tag-row">{card.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="community-stats"><span>도움돼요 18</span><span>댓글 4</span></div>
          </article>
        ))}
      </div>
      <button className="floating-write">경험 나누기</button>
    </div>
  );
}

function More() {
  return (
    <div className="page more-page">
      <Header title="더보기" />
      <div className="profile-card">
        <div className="profile-avatar">서</div><div><strong>김서윤</strong><span>자취 6개월 · 서울 동작구</span></div><button><Icon name="chevron" /></button>
      </div>
      <div className="record-summary"><div><strong>3</strong><span>저장한 사례</span></div><i /><div><strong>2</strong><span>해결한 문제</span></div><i /><div><strong>1</strong><span>작성한 글</span></div></div>
      <div className="menu-group">
        <div className="menu-label">나의 생활 기록</div>
        {["최근 확인한 문제", "저장한 해결 사례", "우리 집 정보"].map((item) => <button key={item}><span>{item}</span><Icon name="chevron" size={17} /></button>)}
      </div>
      <div className="menu-group">
        <div className="menu-label">긴급 설정</div>
        <button><span>집주인 연락처<small>010-****-2048</small></span><Icon name="chevron" size={17} /></button>
        <button><span>SOS 음성 호출 문구<small>“집에 문제가 생겼어”</small></span><Icon name="chevron" size={17} /></button>
      </div>
    </div>
  );
}

function BottomNav({ current, onNavigate, onSos }: { current: string; onNavigate: (screen: Screen) => void; onSos: () => void }) {
  const items = [
    { id: "home", label: "홈", icon: "home" as IconName },
    { id: "cases", label: "사례", icon: "book" as IconName },
    { id: "community", label: "커뮤니티", icon: "chat" as IconName },
    { id: "more", label: "더보기", icon: "more" as IconName },
  ];
  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      {items.slice(0, 2).map((item) => (
        <button key={item.id} className={current === item.id ? "active" : ""} onClick={() => onNavigate(item.id as Screen)}><Icon name={item.icon} size={24} /><span>{item.label}</span></button>
      ))}
      <button className="sos-nav" onClick={onSos} aria-label="긴급 모드"><span><Icon name="alert" size={24} /></span><small>긴급 모드</small></button>
      {items.slice(2).map((item) => (
        <button key={item.id} className={current === item.id ? "active" : ""} onClick={() => onNavigate(item.id as Screen)}><Icon name={item.icon} size={24} /><span>{item.label}</span></button>
      ))}
    </nav>
  );
}

function SosFlow({ step, setStep, onCamera, onClose, onMessage }: { step: number; setStep: (n: number) => void; onCamera: () => void; onClose: () => void; onMessage: () => void }) {
  const content = [
    { kicker: "긴급 문제 접수", title: "어떤 방법으로\n상황을 알려주시겠어요?", text: "가장 편한 방법을 선택하면 지금 필요한 조치를 빠르게 찾아드려요.", icon: "shield" as IconName, button: "" },
    { kicker: "1 · 피해 확산 막기", title: "먼저 수건과 대야를\n가져와 주세요.", text: "물이 퍼지는 곳에 수건을 깔고, 떨어지는 물 아래에 대야를 두세요. 전기 제품은 젖은 손으로 만지지 마세요.", icon: "water" as IconName, button: "임시 조치했어요" },
    { kicker: "2 · 물 잠그기", title: "싱크대 아래 밸브를\n시계 방향으로 잠가요.", text: "은색 또는 파란색 손잡이를 천천히 돌리세요. 밸브가 보이지 않거나 움직이지 않으면 무리하지 마세요.", icon: "tool" as IconName, button: "밸브를 확인했어요" },
    { kicker: "3 · 상황 알리기", title: "이제 집주인에게\n상황을 알려주세요.", text: "지금까지 한 조치와 누수가 시작된 시점을 담아 메시지 초안을 만들어 드릴게요.", icon: "chat" as IconName, button: "메시지 초안 보기" },
  ][step];
  return (
    <div className="sos-screen">
      <div className="sos-screen-top"><span>SOS</span><button onClick={onClose} aria-label="닫기"><Icon name="close" /></button></div>
      <div className="sos-progress">{[0, 1, 2, 3].map((n) => <i key={n} className={n <= step ? "active" : ""} />)}</div>
      <div className="sos-center">
        <div className="sos-illustration"><span><Icon name={content.icon} size={44} /></span></div>
        <div className="sos-kicker">{content.kicker}</div>
        <div className="sos-big-title">{content.title.split("\n").map((line) => <span key={line}>{line}</span>)}</div>
        <p>{content.text}</p>
        {step > 0 && <div className="safety-note"><Icon name="alert" size={19} /><span>위험하다고 느껴지면 즉시 119 또는 관리실에 연락하세요.</span></div>}
      </div>
      <div className="sos-bottom">
        {step === 0 ? (
          <div className="sos-methods">
            <button onClick={onCamera}>
              <span><Icon name="camera" /></span>
              <strong>카메라</strong>
              <small>사진으로 인식</small>
            </button>
            <button onClick={() => setStep(1)}>
              <span><Icon name="mic" /></span>
              <strong>음성인식</strong>
              <small>말로 설명</small>
            </button>
            <button onClick={() => setStep(1)}>
              <span><Icon name="edit" /></span>
              <strong>직접 입력</strong>
              <small>글로 설명</small>
            </button>
          </div>
        ) : (
          <button className="primary-cta" onClick={() => step === 3 ? onMessage() : setStep(step + 1)}>{content.button}</button>
        )}
        {step > 0 && <button className="text-button" onClick={() => setStep(step - 1)}>이전 단계로</button>}
      </div>
    </div>
  );
}

function MessageSheet({ onClose, onSend }: { onClose: () => void; onSend: () => void }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="message-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-header"><div><small>집주인에게 연락하기</small><strong>상황을 정리해드렸어요</strong></div><button onClick={onClose}><Icon name="close" /></button></div>
        <div className="message-preview" contentEditable suppressContentEditableWarning>
          안녕하세요. 오늘 오후부터 욕실 배수구에서 냄새가 계속 올라옵니다. 배수구 주변 이물질을 제거하고 물을 흘려보냈지만 냄새가 남아 있어 확인 부탁드립니다. 방문 가능하신 시간을 알려주시면 맞추겠습니다.
        </div>
        <div className="message-tip"><Icon name="edit" size={17} />문장을 눌러 직접 수정할 수 있어요.</div>
        <button className="primary-cta" onClick={onSend}>메시지 앱에서 보내기</button>
      </div>
    </div>
  );
}

export default App;
