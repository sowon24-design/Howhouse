import { useState, type CSSProperties, type ReactNode } from "react";

type View = "home" | "library" | "case" | "caseCamera" | "caseVoice" | "caseText" | "sos" | "message" | "saved" | "profile";
type IconName =
  | "arrow"
  | "back"
  | "bookmark"
  | "camera"
  | "check"
  | "chevron"
  | "clock"
  | "home"
  | "mic"
  | "person"
  | "search"
  | "spark"
  | "text"
  | "tool";

const categories = [
  ["화장실", "냄새 · 배수구", "01"],
  ["보일러", "난방 · 온수", "02"],
  ["수도·수질", "누수 · 수압", "03"],
  ["세탁기", "배수 · 소음", "04"],
  ["전기·조명", "차단기 · 전구", "05"],
  ["냉장고", "냉기 · 소음", "06"],
  ["해충", "벌레 · 유입", "07"],
  ["곰팡이", "벽지 · 결로", "08"],
  ["쓰레기", "분리배출", "09"],
];

const caseImages = {
  bathroom: "https://images.unsplash.com/photo-1668911094844-527491335108?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1080",
  heating: "https://images.unsplash.com/photo-1599028274511-e02a767949a3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1080",
  leak: "https://images.unsplash.com/photo-1609210884848-2d530cfb2a07?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1080",
};

const categoryImages: Record<string, string> = {
  "화장실": "https://images.unsplash.com/photo-1643949700215-e61cdca053f7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=500",
  "보일러": "https://images.unsplash.com/photo-1618840626133-54463084a141?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=500",
  "수도·수질": "https://images.unsplash.com/photo-1521207418485-99c705420785?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=500",
  "세탁기": "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=500",
  "전기·조명": "https://images.unsplash.com/photo-1504972090022-6edb81e4e534?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=500",
  "냉장고": "https://images.unsplash.com/photo-1642497589194-b0c5f6e16db4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=500",
  "해충": "https://images.unsplash.com/photo-1731344391192-02286c0cf1bb?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=500",
  "곰팡이": "https://images.unsplash.com/photo-1750056661725-4a6d18e9527f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=500",
  "쓰레기": "https://images.unsplash.com/photo-1777537915230-be1d2ab6a63f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=500",
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
    back: <><path d="m15 18-6-6 6-6" /></>,
    bookmark: <><path d="M6 4h12v16l-6-4-6 4z" /></>,
    camera: <><rect x="3" y="6" width="18" height="14" rx="3" /><path d="m8 6 1.5-2h5L16 6" /><circle cx="12" cy="13" r="3.5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
    mic: <><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>,
    person: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" /></>,
    spark: <><path d="m12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7z" /><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" /></>,
    text: <><path d="M4 6h16M8 6v14m8-14v14M6 20h4m4 0h4" /></>,
    tool: <><path d="M14.5 6.5a4 4 0 0 0-5-5l2.2 2.2-3 3-2.2-2.2a4 4 0 0 0 5 5L19 17l2-2-7.5-7.5z" /></>,
  };

  return (
    <svg aria-hidden="true" className="icon" fill="none" height={size} viewBox="0 0 24 24" width={size}>
      {paths[name]}
    </svg>
  );
}

function ActionButton({
  children,
  className = "",
  onClick,
  variant = "dark",
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "dark" | "light" | "line" | "danger";
}) {
  return (
    <button className={`action-button ${variant} ${className}`} onClick={onClick} type="button">
      {children}
    </button>
  );
}

function Header({
  back,
  eyebrow,
  right,
  title,
}: {
  back?: () => void;
  eyebrow?: string;
  right?: ReactNode;
  title: string;
}) {
  return (
    <header className="page-header">
      <div className="header-tools">
        {back ? (
          <button aria-label="뒤로 가기" className="icon-button" onClick={back} type="button">
            <Icon name="back" />
          </button>
        ) : <span className="wordmark">ZIP.</span>}
        {right}
      </div>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
    </header>
  );
}

function BottomNav({ current, navigate }: { current: View; navigate: (view: View) => void }) {
  const items: [View, IconName, string][] = [
    ["home", "home", "홈"],
    ["library", "search", "사례"],
    ["sos", "spark", "긴급"],
    ["saved", "bookmark", "저장"],
    ["profile", "person", "내 정보"],
  ];
  return (
    <nav className="bottom-nav">
      {items.map(([view, icon, label], index) => (
        <button
          className={`${current === view || (current === "case" && view === "library") ? "active" : ""} ${view === "sos" ? "emergency-nav" : ""}`}
          key={`${label}-${index}`}
          onClick={() => navigate(view)}
          type="button"
        >
          <Icon name={icon} size={19} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

function Home({ navigate }: { navigate: (view: View) => void }) {
  return (
    <main className="page home-page">
      <Header
        right={<button aria-label="내 정보" className="avatar-button" onClick={() => navigate("profile")} type="button">SY</button>}
        title={"오늘도,\n잘 살고 있나요?"}
      />

      <button className="sos-card" onClick={() => navigate("sos")} type="button">
        <span className="sos-kicker"><span className="live-dot" /> 즉시 대응이 필요한가요?</span>
        <span className="sos-title">SOS</span>
        <span className="sos-description">누수 · 정전 · 가스 냄새</span>
        <span className="round-arrow"><Icon name="arrow" size={21} /></span>
      </button>

      <button className="explore-card" onClick={() => navigate("library")} type="button">
        <span>
          <span className="card-index">CASE LIBRARY / 24</span>
          <strong>비슷한 문제를<br />찾아보세요</strong>
        </span>
        <span className="explore-visual"><Icon name="search" size={36} /></span>
      </button>

      <section className="section">
        <div className="section-heading">
          <h2>최근 확인한 문제</h2>
          <button onClick={() => navigate("saved")} type="button">전체 보기</button>
        </div>
        <button className="recent-card" onClick={() => navigate("case")} type="button">
          <span className="recent-thumb"><img alt="" src={caseImages.bathroom} /></span>
          <span className="recent-copy">
            <strong>욕실 배수구에서<br />냄새가 올라와요</strong>
            <small>어제 확인 · 약 15분</small>
          </span>
          <Icon name="arrow" />
        </button>
      </section>

      <section className="section category-preview">
        <div className="section-heading"><h2>자주 찾는 공간</h2></div>
        <div className="mini-grid">
          {categories.slice(0, 3).map(([name, detail, number]) => (
            <button key={name} onClick={() => navigate(name === "화장실" ? "case" : "library")} type="button">
              <img alt={`${name} 공간`} src={categoryImages[name]} />
              <span className="mini-number">{number}</span>
              <span className="mini-copy"><strong>{name}</strong><small>{detail}</small></span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function Library({ navigate }: { navigate: (view: View) => void }) {
  return (
    <main className="page">
      <Header eyebrow="CASE LIBRARY" title={"어떤 문제가\n생겼나요?"} />
      <div className="input-strip">
        <button onClick={() => navigate("caseCamera")} type="button"><Icon name="camera" /><span>사진으로<br />확인하기</span></button>
        <button onClick={() => navigate("caseVoice")} type="button"><Icon name="mic" /><span>말로<br />설명하기</span></button>
        <button onClick={() => navigate("caseText")} type="button"><Icon name="text" /><span>직접<br />입력하기</span></button>
      </div>
      <section className="section">
        <div className="section-heading">
          <h2>공간으로 찾기</h2><span className="count-label">9 SPACES</span>
        </div>
        <div className="category-grid">
          {categories.map(([name, detail, number]) => (
            <button key={name} onClick={() => navigate(name === "화장실" ? "case" : "library")} type="button">
              <img alt={`${name} 공간`} className="category-image" src={categoryImages[name]} />
              <span className="category-number">{number}</span>
              <span className="category-copy"><strong>{name}</strong><small>{detail}</small></span>
              <Icon name="arrow" size={17} />
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function CaseCamera({ navigate }: { navigate: (view: View) => void }) {
  const [captured, setCaptured] = useState(false);
  const [flash, setFlash] = useState(false);
  return (
    <main className="camera-page">
      <img alt="카메라 화면에 보이는 욕실" className="camera-feed" src={caseImages.bathroom} />
      <div className="camera-shade" />
      <div className="camera-top">
        <button aria-label="카메라 닫기" onClick={() => navigate("library")} type="button">×</button>
        <span>생활 문제 촬영</span>
        <button aria-label={flash ? "플래시 끄기" : "플래시 켜기"} className={flash ? "flash-on" : ""} onClick={() => setFlash((value) => !value)} type="button">FLASH</button>
      </div>
      <div className="focus-frame">
        <i /><i /><i /><i />
        <span>문제가 보이는 부분과 주변 공간을<br />화면 안에 함께 담아주세요</span>
      </div>
      {captured && (
        <div className="capture-result">
          <span><Icon name="check" size={18} /></span>
          <strong>검색할 사진을 확인했어요</strong>
          <small>욕실과 배수구 주변이 선명하게 보여요.</small>
        </div>
      )}
      <div className="camera-controls">
        {captured ? (
          <>
            <button className="camera-secondary" onClick={() => setCaptured(false)} type="button">다시 찍기</button>
            <button className="use-photo" onClick={() => navigate("case")} type="button">이 사진으로 검색 <Icon name="arrow" size={18} /></button>
          </>
        ) : (
          <>
            <button className="gallery-button" aria-label="최근 사진 선택" type="button"><img alt="" src={caseImages.bathroom} /></button>
            <button aria-label="사진 촬영" className="shutter-button" onClick={() => setCaptured(true)} type="button"><span /></button>
            <button className="direct-button" onClick={() => navigate("caseText")} type="button">직접<br />입력</button>
          </>
        )}
      </div>
    </main>
  );
}

function CaseVoice({ navigate }: { navigate: (view: View) => void }) {
  const [recording, setRecording] = useState(false);
  const [recognized, setRecognized] = useState(false);
  if (recognized) {
    return (
      <main className="page case-voice-result">
        <Header back={() => setRecognized(false)} eyebrow="VOICE SEARCH" title={"말씀하신 문제와\n비슷한 사례예요"} />
        <section className="transcript-card">
          <span><Icon name="mic" size={16} /> 인식된 내용</span>
          <blockquote>“욕실 배수구에서 자꾸 냄새가 올라와요.”</blockquote>
          <button onClick={() => setRecognized(false)} type="button">다시 말하기</button>
        </section>
        <section className="voice-match-card">
          <img alt="배수구 문제와 관련된 욕실" src={caseImages.bathroom} />
          <div><span>일치도 92%</span><strong>욕실 배수구에서<br />냄새가 올라와요</strong><small>직접 해결 68% · 약 15분</small></div>
        </section>
        <div className="sticky-actions single">
          <ActionButton onClick={() => navigate("case")}>해결 사례 확인하기 <Icon name="arrow" /></ActionButton>
        </div>
      </main>
    );
  }
  return (
    <main className={recording ? "page voice-page recording" : "page voice-page"}>
      <Header back={() => navigate("library")} eyebrow="VOICE SEARCH" title={recording ? "문제를 듣고 있어요" : "어떤 문제인지\n말씀해 주세요"} />
      <div className="voice-orbit">
        <span className="voice-pulse" /><span className="voice-pulse second" />
        <span className="voice-mic"><Icon name="mic" size={32} /></span>
        {recording && <div className="waveform">{[2,4,3,6,8,5,9,4,7,3,5,2].map((height, index) => <i key={index} style={{ "--bar": height } as CSSProperties} />)}</div>}
      </div>
      <section className="voice-copy">
        {recording ? <><span className="recording-label"><i /> 녹음 중</span><blockquote>말씀하시는 내용을 듣고 있어요</blockquote></> : <><h2>무슨 문제인지 몰라도 괜찮아요</h2><blockquote>지금 보이거나 들리는 상황을<br />편하게 설명해 주세요</blockquote></>}
        <p>공간과 증상을 함께 말하면 비슷한 해결 사례를 찾아드려요.</p>
      </section>
      <div className="voice-controls">
        <ActionButton onClick={() => recording ? (setRecording(false), setRecognized(true)) : setRecording(true)} variant={recording ? "danger" : "dark"}>
          <Icon name={recording ? "check" : "mic"} />{recording ? "녹음 종료하고 검색" : "녹음 시작"}
        </ActionButton>
      </div>
    </main>
  );
}

function CaseText({ navigate }: { navigate: (view: View) => void }) {
  const [query, setQuery] = useState("");
  return (
    <main className="page text-search-page">
      <Header back={() => navigate("library")} eyebrow="TEXT SEARCH" title={"문제를 직접\n입력해 주세요"} />
      <section className="text-search-box">
        <label htmlFor="problem-query">어떤 일이 생겼나요?</label>
        <textarea
          id="problem-query"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="예: 욕실 배수구에서 며칠 전부터 냄새가 올라와요."
          value={query}
        />
        <span>{query.length} / 200</span>
      </section>
      <section className="example-queries">
        <h2>자주 입력하는 문제</h2>
        <div>
          {["배수구 냄새", "온수가 안 나와요", "세탁기 물이 안 빠져요", "전등이 깜빡여요"].map((example) => (
            <button key={example} onClick={() => setQuery(example)} type="button">{example}</button>
          ))}
        </div>
      </section>
      <aside className="scope-note"><Icon name="spark" /><p><strong>검색 도움말</strong>문제가 생긴 공간, 증상, 시작 시점을 함께 입력하면 더 비슷한 사례를 찾을 수 있어요.</p></aside>
      <div className="sticky-actions single">
        <button className="text-search-submit" disabled={!query.trim()} onClick={() => navigate("case")} type="button">
          {query.trim() ? <>비슷한 사례 검색하기 <Icon name="arrow" /></> : "문제를 입력해 주세요"}
        </button>
      </div>
    </main>
  );
}

function CaseDetail({ navigate }: { navigate: (view: View) => void }) {
  const [checked, setChecked] = useState<number[]>([]);
  const toggle = (step: number) => setChecked((current) => current.includes(step) ? current.filter((item) => item !== step) : [...current, step]);
  const steps = [
    ["확인", "배수구 덮개를 열고 머리카락이나 이물질이 보이는지 확인해요."],
    ["조치", "장갑을 끼고 이물질을 제거한 뒤, 미지근한 물을 천천히 흘려보내요."],
    ["결과 확인", "10분 뒤 냄새가 줄었는지 확인해요. 계속되면 트랩 문제일 수 있어요."],
  ];
  return (
    <main className="page detail-page">
      <Header
        back={() => navigate("library")}
        right={<button aria-label="저장하기" className="icon-button" type="button"><Icon name="bookmark" /></button>}
        title={"욕실 배수구에서\n냄새가 올라와요"}
      />
      <div className="status-band">
        <div><strong>68%</strong><span>직접 해결했어요</span></div>
        <div><strong>15분</strong><span>평균 소요 시간</span></div>
        <div><strong>쉬움</strong><span>해결 난이도</span></div>
      </div>
      <figure className="case-image">
        <img alt="세면대와 배수 공간이 보이는 밝은 욕실" src={caseImages.bathroom} />
        <figcaption>욕실 · 배수구 악취 사례 <span>Photo by Point3D Commercial Imaging Ltd.</span></figcaption>
      </figure>
      <section className="case-story">
        <div className="story-top">
          <span className="user-mark">ㅈ</span>
          <span><strong>자취생 ㅈ**</strong><small>자취 8개월 · 원룸</small></span>
          <span className="verified">검토됨</span>
        </div>
        <p>샤워하고 나면 괜찮은데 반나절쯤 지나면 하수구 냄새가 올라왔어요. 배수구에 낀 머리카락을 치우고 물을 채우니 많이 줄었습니다.</p>
        <div className="tags"><span>#욕실</span><span>#배수구</span><span>#악취</span></div>
      </section>
      <section className="steps-section">
        <div className="section-heading">
          <h2>이 순서로 해보세요</h2>
          <span className="count-label">{checked.length}/3 DONE</span>
        </div>
        <div className="timeline">
          {steps.map(([title, copy], index) => (
            <button className={checked.includes(index) ? "step checked" : "step"} key={title} onClick={() => toggle(index)} type="button">
              <span className="step-marker">{checked.includes(index) ? <Icon name="check" size={17} /> : `0${index + 1}`}</span>
              <span><small>STEP {index + 1}</small><strong>{title}</strong><p>{copy}</p></span>
            </button>
          ))}
        </div>
      </section>
      <div className="sticky-actions">
        <ActionButton onClick={() => navigate("message")} variant="light">집주인에게 연락하기</ActionButton>
        <ActionButton onClick={() => navigate("library")}>다른 사례 보기 <Icon name="arrow" /></ActionButton>
      </div>
    </main>
  );
}

function Sos({ navigate }: { navigate: (view: View) => void }) {
  const [stage, setStage] = useState<"start" | "camera" | "select" | "issue" | "voice" | "voiceResult" | "actions">("start");
  const [done, setDone] = useState<number[]>([]);
  const [flash, setFlash] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const toggle = (index: number) => setDone((value) => value.includes(index) ? value.filter((item) => item !== index) : [...value, index]);
  if (stage === "camera") {
    return (
      <main className="camera-page">
        <img alt="카메라 화면에 보이는 싱크대와 수도꼭지" className="camera-feed" src={caseImages.leak} />
        <div className="camera-shade" />
        <div className="camera-top">
          <button aria-label="카메라 닫기" onClick={() => { setCaptured(false); setStage("start"); }} type="button">×</button>
          <span>상황 촬영</span>
          <button aria-label={flash ? "플래시 끄기" : "플래시 켜기"} className={flash ? "flash-on" : ""} onClick={() => setFlash((value) => !value)} type="button">FLASH</button>
        </div>
        <div className="focus-frame">
          <i /><i /><i /><i />
          <span>문제 지점과 주변이 함께 보이게<br />화면 안에 맞춰주세요.<br />조금 흔들려도 괜찮아요.</span>
        </div>
        {captured && (
          <div className="capture-result">
            <span><Icon name="check" size={18} /></span>
            <strong>사진이 선명하게 찍혔어요</strong>
            <small>누수 지점과 싱크대 배관이 확인돼요.</small>
          </div>
        )}
        <div className="camera-controls">
          {captured ? (
            <>
              <button className="camera-secondary" onClick={() => setCaptured(false)} type="button">다시 찍기</button>
              <button className="use-photo" onClick={() => setStage("actions")} type="button">이 사진 사용하기 <Icon name="arrow" size={18} /></button>
            </>
          ) : (
            <>
              <button className="gallery-button" aria-label="최근 사진 선택" type="button"><img alt="" src={caseImages.bathroom} /></button>
              <button aria-label="사진 촬영" className="shutter-button" onClick={() => setCaptured(true)} type="button"><span /></button>
              <button className="direct-button" onClick={() => setStage("select")} type="button">직접<br />선택</button>
            </>
          )}
        </div>
      </main>
    );
  }
  if (stage === "voice") {
    return (
      <main className={recording ? "page voice-page recording" : "page voice-page"}>
        <Header back={() => { setRecording(false); setStage("start"); }} eyebrow="VOICE SEARCH" title={recording ? "듣고 있어요" : "문제를 말로\n설명해 주세요"} />
        <div className="voice-orbit">
          <span className="voice-pulse" />
          <span className="voice-pulse second" />
          <span className="voice-mic"><Icon name={recording ? "mic" : "spark"} size={32} /></span>
          {recording && <div className="waveform">{[2,4,3,6,8,5,9,4,7,3,5,2].map((height, index) => <i key={index} style={{ "--bar": height } as CSSProperties} />)}</div>}
        </div>
        <section className="voice-copy">
          {recording ? (
            <>
              <span className="recording-label"><i /> 녹음 중</span>
              <blockquote>말씀하시는 내용을 듣고 있어요</blockquote>
              <p>문장을 완성하지 않아도 괜찮아요.<br />보이는 것과 들리는 것을 편하게 말해 주세요.</p>
            </>
          ) : (
            <>
              <h2>무슨 문제인지 몰라도 괜찮아요</h2>
              <blockquote>지금 보이거나 들리는 상황을<br />편하게 설명해 주세요</blockquote>
              <p>문제가 생긴 공간, 보이는 증상,<br />처음 발견한 시간을 함께 말하면 좋아요.</p>
            </>
          )}
        </section>
        <div className="voice-controls">
          <ActionButton
            onClick={() => {
              if (recording) {
                setRecording(false);
                setStage("voiceResult");
              } else {
                setRecording(true);
              }
            }}
            variant={recording ? "danger" : "dark"}
          >
            <Icon name={recording ? "check" : "mic"} />
            {recording ? "녹음 종료하고 결과 보기" : "녹음 시작"}
          </ActionButton>
          {!recording && <p>음성은 문제 분석을 위해서만 사용돼요.</p>}
        </div>
      </main>
    );
  }
  if (stage === "voiceResult") {
    return (
      <main className="page voice-result-page">
        <Header back={() => setStage("voice")} eyebrow="VOICE RESULT" title={"말씀하신 내용을\n확인했어요"} />
        <section className="transcript-card">
          <span><Icon name="mic" size={16} /> 인식된 내용</span>
          <blockquote>“싱크대 아래에서 물이 계속 새고 있고, 바닥까지 번지고 있어요.”</blockquote>
          <button onClick={() => setStage("voice")} type="button">다시 말하기</button>
        </section>
        <div className="voice-analysis">
          <span>분석 결과</span>
          <strong>싱크대 급수 배관 누수 가능성이 높아요</strong>
          <div><small>긴급도 · 높음</small><small>예상 조치 · 10분</small></div>
        </div>
        <section className="suggested-actions">
          <div className="section-heading"><h2>지금 바로 해주세요</h2><span className="count-label">2 STEPS</span></div>
          <article><span>01</span><p><strong>수건과 대야 놓기</strong>고인 물이 콘센트 쪽으로 번지지 않게 막아주세요.</p></article>
          <article><span>02</span><p><strong>급수 밸브 잠그기</strong>싱크대 아래 밸브를 시계 방향으로 잠가주세요.</p></article>
        </section>
        <aside className="voice-notice"><span className="live-dot" /><p>조치 후에도 물이 계속 새면 집주인에게 바로 알려야 해요.</p></aside>
        <div className="sticky-actions single">
          <ActionButton onClick={() => navigate("message")} variant="danger">집주인에게 알리기 <Icon name="arrow" /></ActionButton>
        </div>
      </main>
    );
  }
  if (stage === "select") {
    const locations = [
      ["부엌", "싱크대 · 가스 · 가전", "01"],
      ["화장실", "변기 · 세면대 · 배수", "02"],
      ["세탁 공간", "세탁기 · 급배수 호스", "03"],
      ["보일러", "난방 · 온수 · 배관", "04"],
      ["전기·조명", "콘센트 · 차단기 · 전등", "05"],
      ["잘 모르겠어요", "공간을 특정하기 어려움", "06"],
    ];
    return (
      <main className="page direct-select-page">
        <Header back={() => setStage("start")} eyebrow="DIRECT SELECT" title={"어디에서 문제가\n발생했나요?"} />
        <p className="select-guide">사진 없이도 괜찮아요. 문제가 발생한 공간과 가장 가까운 항목을 선택해 주세요.</p>
        <section className="location-grid">
          {locations.map(([name, detail, number]) => (
            <button
              className={selectedLocation === name ? "selected" : ""}
              key={name}
              onClick={() => {
                setSelectedLocation(name);
                setStage("issue");
              }}
              type="button"
            >
              <span className="location-number">{number}</span>
              <span className="location-check"><Icon name="arrow" size={14} /></span>
              <strong>{name}</strong>
              <small>{detail}</small>
            </button>
          ))}
        </section>
        <aside className="select-safety">
          <span className="live-dot" />
          <p><strong>물이 콘센트나 전선에 닿았다면</strong>직접 만지지 말고 즉시 현장에서 벗어나세요.</p>
        </aside>
      </main>
    );
  }
  if (stage === "issue") {
    const kitchenIssues = [
      ["누수", "물이 새거나 바닥에 고여요"],
      ["배수 문제", "물이 내려가지 않거나 역류해요"],
      ["악취", "싱크대에서 냄새가 올라와요"],
      ["가스 냄새", "가스 냄새가 나거나 경보가 울려요"],
      ["수전 고장", "수도꼭지가 잠기지 않아요"],
      ["가전 문제", "냉장고나 인덕션이 작동하지 않아요"],
    ];
    const commonIssues = [
      ["누수", "물이 새거나 주변에 고여요"],
      ["작동 안 함", "기기나 설비가 켜지지 않아요"],
      ["냄새", "평소와 다른 냄새가 나요"],
      ["소음·진동", "이상한 소리나 진동이 발생해요"],
      ["파손", "부품이나 시설이 깨졌어요"],
      ["잘 모르겠어요", "증상을 정확히 설명하기 어려워요"],
    ];
    const issues = selectedLocation === "부엌" ? kitchenIssues : commonIssues;
    return (
      <main className="page issue-select-page">
        <Header back={() => setStage("select")} eyebrow={`${selectedLocation ?? "공간"} · PROBLEM`} title={"어떤 문제가\n발생했나요?"} />
        <p className="select-guide">{selectedLocation ?? "선택한 공간"}에서 확인한 증상과 가장 가까운 항목을 선택해 주세요.</p>
        <section className="issue-list">
          {issues.map(([name, detail], index) => (
            <button
              key={name}
              onClick={() => {
                if (name === "누수") {
                  setSelectedLocation(selectedLocation === "부엌" ? "싱크대 아래" : selectedLocation);
                  setStage("actions");
                } else {
                  navigate("library");
                }
              }}
              type="button"
            >
              <span className="issue-index">0{index + 1}</span>
              <span className="issue-copy"><strong>{name}</strong><small>{detail}</small></span>
              <Icon name="chevron" size={17} />
            </button>
          ))}
        </section>
        <p className="issue-footnote">긴급하지 않은 문제는 선택 후 유사 해결 사례로 연결돼요.</p>
      </main>
    );
  }
  if (stage === "start") {
    return (
      <main className="page sos-page">
        <Header back={() => navigate("home")} eyebrow="EMERGENCY MODE" title={"문제가 생겼나요?\n빠른 해결을 도와줄게요"} />
        <div className="emergency-orbit"><span>SOS</span><small>STEP 01</small></div>
        <section className="sos-intro">
          <h2>상황을 먼저 보여주세요</h2>
          <p>사진을 확인해 피해가 커지지 않도록<br />가장 먼저 할 일을 안내할게요.</p>
        </section>
        <div className="sos-buttons">
          <ActionButton onClick={() => setStage("camera")} variant="danger"><Icon name="camera" /> 사진 촬영하기</ActionButton>
          <div className="sos-alternative-buttons">
            <ActionButton onClick={() => setStage("select")} variant="line">블록 선택으로 검색</ActionButton>
            <ActionButton onClick={() => setStage("voice")} variant="line"><Icon name="mic" size={17} /> 음성 인식 검색</ActionButton>
          </div>
        </div>
        <p className="safety-note">감전이나 가스 위험이 있으면 즉시 현장에서 벗어나 119에 연락하세요.</p>
      </main>
    );
  }
  const actions = [
    ["물 확산 막기", "수건이나 걸레로 고인 물을 막고, 대야를 누수 지점 아래에 놓으세요.", "지금 바로"],
    ["가까운 급수 밸브 잠그기", "싱크대나 세면대 아래 냉·온수 밸브를 시계 방향으로 끝까지 돌리세요.", "다음 조치"],
  ];
  return (
    <main className="page sos-action-page">
      <Header back={() => setStage(captured ? "camera" : selectedLocation ? "select" : "start")} eyebrow="LEAK · WATER" title={`${selectedLocation ?? "싱크대 아래"}\n누수로 보여요`} />
      {captured && (
        <section className="captured-photo-card">
          <img alt="내가 촬영한 싱크대 누수 사진" src={caseImages.leak} />
          <div className="captured-photo-label">
            <span><Icon name="camera" size={15} /> 내가 찍은 사진</span>
            <button onClick={() => { setCaptured(false); setStage("camera"); }} type="button">다시 촬영</button>
          </div>
          <div className="analysis-badge"><Icon name="spark" size={13} /> 사진 확인 완료</div>
        </section>
      )}
      <div className="alert-strip"><span className="live-dot" /> 피해 확산을 먼저 막아주세요</div>
      <section className="action-list">
        {actions.map(([title, copy, label], index) => (
          <article className={done.includes(index) ? "emergency-step done" : "emergency-step"} key={title}>
            <div className="emergency-step-head">
              <span className="step-big">0{index + 1}</span>
              <span className="urgency">{label}</span>
            </div>
            <h2>{title}</h2>
            <p>{copy}</p>
            {index === 1 && <div className="valve-diagram"><span /><span className="valve-handle" /><small>시계 방향으로 잠그기</small></div>}
            <ActionButton onClick={() => toggle(index)} variant={done.includes(index) ? "light" : "dark"}>
              {done.includes(index) ? <><Icon name="check" /> 조치했어요</> : <>완료했어요 <Icon name="arrow" /></>}
            </ActionButton>
          </article>
        ))}
      </section>
      <div className="sticky-actions single">
        <ActionButton onClick={() => navigate("message")} variant="danger">집주인에게 바로 알리기 <Icon name="arrow" /></ActionButton>
      </div>
    </main>
  );
}

function MessageDraft({ navigate }: { navigate: (view: View) => void }) {
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("안녕하세요. 지금 싱크대 아래에서 누수가 확인되어 연락드립니다.\n\n수건과 대야로 물이 퍼지는 것을 막았고, 싱크대 아래 밸브도 잠근 상태입니다. 가능한 방문 일정을 알려주실 수 있을까요?");
  return (
    <main className="page message-page">
      <Header back={() => navigate("sos")} eyebrow="MESSAGE ASSIST" title={"상황을 정리해\n알려드릴게요"} />
      <div className="recipient">
        <span className="user-mark">집</span>
        <span><small>받는 사람</small><strong>집주인 · 김**</strong></span>
        <button type="button">변경</button>
      </div>
      <section className="draft-section">
        <div className="section-heading"><h2>메시지 초안</h2><span className="ai-label"><Icon name="spark" size={15} /> 상황 반영됨</span></div>
        <textarea aria-label="집주인에게 보낼 메시지" onChange={(event) => setMessage(event.target.value)} value={message} />
        <div className="message-tags">
          <button type="button">+ 사진 첨부</button>
          <button type="button">+ 방문 가능 시간</button>
        </div>
      </section>
      <aside className="scope-note">
        <Icon name="tool" />
        <p><strong>확인해 주세요</strong>비용과 책임 범위는 집주인과 직접 협의해야 해요.</p>
      </aside>
      <div className="sticky-actions single">
        <ActionButton onClick={() => setSent(true)} variant={sent ? "light" : "dark"}>
          {sent ? <><Icon name="check" /> 전송 준비 완료</> : <>메시지 앱으로 보내기 <Icon name="arrow" /></>}
        </ActionButton>
      </div>
      {sent && <div className="toast">초안이 준비됐어요. 전송 전 내용을 한 번 더 확인하세요.</div>}
    </main>
  );
}

function Saved({ navigate }: { navigate: (view: View) => void }) {
  return (
    <main className="page">
      <Header eyebrow="SAVED CASES" title={"다시 볼\n해결 사례"} />
      <section className="section">
        <div className="section-heading"><h2>저장한 사례</h2><span className="count-label">2 SAVED</span></div>
        <button className="saved-row" onClick={() => navigate("case")} type="button"><img alt="" src={caseImages.bathroom} /><strong>욕실 배수구에서<br />냄새가 올라와요</strong><Icon name="chevron" /></button>
        <button className="saved-row" type="button"><img alt="" src={caseImages.heating} /><strong>보일러 온수가<br />갑자기 안 나와요</strong><Icon name="chevron" /></button>
      </section>
      <section className="section">
        <div className="section-heading"><h2>최근 확인</h2><span className="count-label">HISTORY</span></div>
        <button className="history-row" onClick={() => navigate("case")} type="button">
          <span>03.18</span><strong>욕실 배수구 악취</strong><small>단계 3개 완료</small><Icon name="chevron" />
        </button>
      </section>
    </main>
  );
}

function Profile({ navigate }: { navigate: (view: View) => void }) {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  return (
    <main className="page profile-page">
      <Header eyebrow="MY ZIP" title={"서윤님의\n생활 정보"} />
      <section className="profile-card">
        <span className="profile-initial">SY</span>
        <span className="profile-copy"><small>자취 6개월 차</small><strong>김서윤</strong><span>서울 동작구 · 다세대주택 원룸</span></span>
        <button aria-label="프로필 수정" type="button">수정</button>
      </section>

      <section className="profile-section">
        <div className="section-heading"><h2>주거 정보</h2><span className="count-label">HOME</span></div>
        <div className="info-grid">
          <button type="button"><small>주거 형태</small><strong>다세대주택</strong><Icon name="chevron" size={16} /></button>
          <button type="button"><small>거주 공간</small><strong>3층 원룸</strong><Icon name="chevron" size={16} /></button>
          <button type="button"><small>입주 시기</small><strong>2025. 09</strong><Icon name="chevron" size={16} /></button>
          <button type="button"><small>난방 방식</small><strong>개별난방</strong><Icon name="chevron" size={16} /></button>
        </div>
      </section>

      <section className="profile-section">
        <div className="section-heading"><h2>긴급 연락과 설정</h2><span className="count-label">SOS</span></div>
        <div className="profile-list">
          <button type="button">
            <span className="list-icon"><Icon name="person" size={18} /></span>
            <span><small>집주인 연락처</small><strong>김** · 010-****-1024</strong></span>
            <Icon name="chevron" size={17} />
          </button>
          <button onClick={() => setVoiceEnabled((value) => !value)} type="button">
            <span className="list-icon"><Icon name="mic" size={18} /></span>
            <span><small>SOS 음성 호출</small><strong>“도와줘, 자취집”</strong></span>
            <span className={voiceEnabled ? "toggle on" : "toggle"}><i /></span>
          </button>
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-links">
          <button onClick={() => navigate("saved")} type="button"><span>저장한 해결 사례</span><strong>2개</strong><Icon name="chevron" size={17} /></button>
          <button type="button"><span>알림 설정</span><strong>켜짐</strong><Icon name="chevron" size={17} /></button>
          <button type="button"><span>도움말 및 서비스 안내</span><Icon name="chevron" size={17} /></button>
        </div>
      </section>
      <p className="app-version">ZIP LIVING GUIDE · VERSION 0.1</p>
    </main>
  );
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const navigate = (next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="app-shell">
      <div className="phone-frame">
        <div className="status-bar"><span>9:41</span><span className="dynamic-island" /><span>● ◒ ▰</span></div>
        {view === "home" && <Home navigate={navigate} />}
        {view === "library" && <Library navigate={navigate} />}
        {view === "caseCamera" && <CaseCamera navigate={navigate} />}
        {view === "caseVoice" && <CaseVoice navigate={navigate} />}
        {view === "caseText" && <CaseText navigate={navigate} />}
        {view === "case" && <CaseDetail navigate={navigate} />}
        {view === "sos" && <Sos navigate={navigate} />}
        {view === "message" && <MessageDraft navigate={navigate} />}
        {view === "saved" && <Saved navigate={navigate} />}
        {view === "profile" && <Profile navigate={navigate} />}
        {!["sos", "message", "caseCamera", "caseVoice", "caseText"].includes(view) && <BottomNav current={view} navigate={navigate} />}
      </div>
      <aside className="desktop-caption">
        <span>ZIP / LIVING GUIDE</span>
        <h2>처음 겪는 생활 문제도<br />다음 행동은 분명하게.</h2>
        <p>자취 초보를 위한 해결사례 도서관과<br />긴급상황 SOS 프로토타입</p>
      </aside>
    </div>
  );
}
