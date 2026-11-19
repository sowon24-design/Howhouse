// @ts-nocheck
// Figma 336:30827: D01 마이. Exact supplied artwork and copy; interactive adaptation is in Scene.tsx.
import imgSize24StyleFill from '../assets/4764e9f6-13fe-4886-b6ff-bbf6a3e91d2e.svg'
import imgSize28StyleFill from '../assets/1f326d16-1146-49e9-8566-671b3a5b23a5.svg'
import imgSize28StyleFill1 from '../assets/80b4b59c-3f50-44a6-9d1e-63f4bbc36349.svg'
import img3D from '../assets/16d014df-f914-42c3-9a1c-9f9a119cf6d3.png'
import imgImage8 from '../assets/0477c8a2-7310-4ed6-8997-21f19c997e46.png'
import img3D1 from '../assets/0534e93d-9ed3-438f-ac9a-7ee21bc7372a.png'
import imgStatusBar from '../assets/180fe36a-72a7-4086-b076-ea3a9b839e7b.svg'
import imgGroup from '../assets/06297317-cde9-492d-a172-8f5497dddbc9.svg'
import imgGroup1 from '../assets/6967d09e-0789-43e8-b6e5-6e7f4132e0ba.svg'
import imgLine3 from '../assets/5c36c893-5c63-4a90-9c58-4197330eae86.svg'
import imgIconLocate from '../assets/599527f1-d187-4e54-8ac9-96a9423ed183.svg'
import imgIconWrite from '../assets/290dad59-4362-48ac-bd93-bb04da074d35.svg'
import imgIconArrowLeft from '../assets/220d92e3-16c4-4358-b63b-c0e9f8c15ce6.svg'
import imgIconCommunity from '../assets/a6f149cd-fa23-483c-a617-e614d085adfa.svg'
import imgIconBook from '../assets/4ac50d1f-48a6-40d0-b9d9-7d8938b4d031.svg'
import imgIconProfile from '../assets/ed9c5682-dcd9-4a11-b30f-ba2264e15842.svg'

type IconCommunityProps = {
  className?: string;
  size?: "24";
  style?: "Fill";
};

function IconCommunity({ className, size = "24", style = "Fill" }: IconCommunityProps) {
  return (
    <div className={className || "cg9 cg117"} data-node-id="355:7403">
      <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgSize24StyleFill} />
    </div>
  );
}

type IconBookProps = {
  className?: string;
  size?: "28";
  style?: "Fill";
};

function IconBook({ className, size = "28", style = "Fill" }: IconBookProps) {
  return (
    <div className={className || "cg9 cg122"} data-node-id="411:4290">
      <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgSize28StyleFill} />
    </div>
  );
}

type IconHomeProps = {
  className?: string;
  size?: "28";
  style?: "Fill";
};

function IconHome({ className, size = "28", style = "Fill" }: IconHomeProps) {
  return (
    <div className={className || "cg9 cg122"} data-node-id="355:7433">
      <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgSize28StyleFill1} />
    </div>
  );
}

function Component({ className }: { className?: string }) {
  return (
    <div className={className || "cg73 cg48 cg9 cg29 cg497"} data-node-id="441:16423" data-name="썸네일">
      <div className="cg0 cg472 cg87 cg410 cg473" data-node-id="441:16417" data-name="3D / 싱크대 누수 · 투명 배경">
        <img alt="" className="cg0 cg2 cg3 cg33 cg31 cg4" src={img3D} />
      </div>
      <div className="cg0 cg474 cg147 cg223 cg475 cg87 cg476 cg477 cg478" data-node-id="441:16418" />
      <div className="cg0 cg5 cg6 cg14 cg8 cg87 cg141 cg479 cg478" data-node-id="441:16419">
        <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg179 cg11" data-node-id="441:16420">
          부엌
        </p>
        <div className="cg5 cg6 cg14 cg8 cg9 cg10 cg11" data-node-id="441:16421">
          <p className="cg12 cg19 cg16 cg18 cg20 cg9 cg10 cg59 cg179 cg23 cg11" data-node-id="441:16422">
            싱크대 누수
          </p>
        </div>
      </div>
    </div>
  );
}

export default function D01() {
  return (
    <div className="cg47 cg5 cg6 cg14 cg8 cg48 cg9 cg50 cg4" data-node-id="336:30827" data-name="D01 마이">
      <div className="cg5 cg6 cg14 cg51 cg52 cg35 cg53 cg9 cg10 cg11" data-node-id="336:30828" data-name="상단바">
        <div className="cg54 cg9 cg10 cg55" data-node-id="336:30830" data-name="status bar">
          <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgStatusBar} />
        </div>
      </div>
      <div className="cg47 cg5 cg6 cg56 cg35 cg57 cg48 cg58 cg9 cg10 cg11" data-node-id="414:4909" data-name="GNB">
        <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg59 cg22 cg24" data-node-id="I414:4909;411:4585">
          마이 페이지
        </p>
      </div>
      <div className="cg5 cg6 cg14 cg156 cg8 cg48 cg480 cg481 cg58 cg9 cg10 cg11" data-node-id="336:30857" data-name="My / Scroll content">
        <div className="cg5 cg6 cg14 cg243 cg8 cg48 cg482 cg9 cg113 cg10 cg11" data-node-id="1047:18835" style={{ backgroundImage: "linear-gradient(146.15994376107446deg, rgba(48, 146, 240, 0) 24.161%, rgb(48, 146, 240) 99.93%), linear-gradient(90deg, rgb(20, 59, 216) 0%, rgba(0, 47, 234, 0.5) 100%)" }} data-name="Profile and 마음 평수">
          <div className="cg5 cg6 cg7 cg8 cg40 cg48 cg9 cg10 cg11" data-node-id="1047:18836" data-name="Profile header">
            <div className="cg416 cg190 cg5 cg6 cg14 cg35 cg40 cg48 cg9 cg418 cg30 cg10" data-node-id="1047:18837" data-name="Text">
              <div className="cg137 cg284 cg0 cg483 cg139 cg420 cg484" data-node-id="1047:18838" data-name="image 8">
                <img alt="" className="cg0 cg2 cg3 cg33 cg31 cg4" src={imgImage8} />
              </div>
            </div>
            <div className="cg12 cg5 cg6 cg13 cg14 cg15 cg8 cg16 cg17 cg18 cg48 cg9" data-node-id="1047:18839" data-name="Identity">
              <p className="cg19 cg9 cg10 cg59 cg179 cg485" data-node-id="1047:18840">
                김서윤
              </p>
              <p className="cg25 cg9 cg10 cg26 cg486 cg485" data-node-id="1047:18841">
                자취 6개월
              </p>
            </div>
            <div className="cg48 cg9 cg10 cg117" data-node-id="1047:18842" data-name="Icon/Setting">
              <div className="cg0 cg487" data-node-id="I1047:18842;408:4545" data-name="Group">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgGroup} />
              </div>
            </div>
          </div>
          <div className="cg5 cg6 cg14 cg15 cg8 cg48 cg9 cg10 cg11" data-node-id="1047:18843" data-name="마음 평수">
            <div className="cg5 cg6 cg35 cg57 cg48 cg9 cg10 cg11" data-node-id="1047:18844" data-name="Reward header">
              <div className="cg5 cg6 cg15 cg35 cg9 cg10" data-node-id="1047:18845">
                <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg486 cg24" data-node-id="1047:18846">
                  마음 평수
                </p>
                <div className="cg48 cg9 cg10 cg36" data-node-id="1047:18847" data-name="Icon/Info">
                  <div className="cg0 cg6 cg214 cg35 cg40" data-node-id="I1047:18847;431:14727" style={{ containerType: "size" }}>
                    <div className="cg378 cg379 cg42 cg380 cg381">
                      <div className="cg9 cg4" data-name="Group">
                        <div className="cg0 cg215">
                          <img alt="" className="cg1 cg3 cg4" src={imgGroup1} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cg12 cg5 cg6 cg15 cg35 cg212 cg18 cg9 cg10 cg179" data-node-id="1047:18848">
                <p className="cg65 cg38 cg9 cg10 cg488 cg24" data-node-id="1047:18849">
                  12
                </p>
                <p className="cg19 cg489 cg16 cg9 cg10 cg21 cg490" data-node-id="1047:18850">
                  평
                </p>
              </div>
            </div>
            <div className="cg491 cg5 cg6 cg492 cg8 cg48 cg9 cg129 cg10 cg11" data-node-id="1047:18851" data-name="Progress track">
              <div className="cg164 cg492 cg9 cg129 cg10 cg493" data-node-id="1047:18852" data-name="Rectangle" />
            </div>
          </div>
          <div className="cg491 cg5 cg6 cg34 cg35 cg494 cg9 cg200 cg10 cg11" data-node-id="1047:18853">
            <div className="cg12 cg5 cg6 cg13 cg14 cg35 cg17 cg18 cg9 cg24" data-node-id="1047:18854">
              <div className="cg6 cg14 cg19 cg40 cg66 cg9 cg10 cg59 cg179 cg495" data-node-id="1047:18855">
                <p className="cg16">8건</p>
              </div>
              <p className="cg37 cg38 cg9 cg10 cg26 cg120" data-node-id="1047:18856">
                해결한 문제
              </p>
            </div>
            <div className="cg6 cg489 cg35 cg40 cg9 cg10 cg41" data-node-id="1047:18857">
              <div className="cg42 cg43">
                <div className="cg44 cg9 cg496">
                  <div className="cg0 cg46">
                    <img alt="" className="cg1 cg3 cg4" src={imgLine3} />
                  </div>
                </div>
              </div>
            </div>
            <div className="cg12 cg5 cg6 cg13 cg14 cg35 cg17 cg18 cg9 cg24" data-node-id="1047:18858">
              <div className="cg6 cg14 cg19 cg40 cg66 cg9 cg10 cg59 cg179 cg495" data-node-id="1047:18859">
                <p className="cg16">8개</p>
              </div>
              <p className="cg37 cg38 cg9 cg10 cg26 cg120" data-node-id="1047:18860">
                작성한 글
              </p>
            </div>
          </div>
        </div>
        <div className="cg5 cg6 cg14 cg34 cg8 cg48 cg9 cg10 cg11" data-node-id="336:30890" data-name="Address section">
          <div className="cg12 cg5 cg6 cg35 cg57 cg18 cg9 cg10 cg11 cg24" data-node-id="336:30891">
            <p className="cg19 cg16 cg9 cg10 cg21 cg162" data-node-id="336:30892">
              나의 주소
            </p>
            <p className="cg37 cg38 cg9 cg10 cg26 cg69" data-node-id="336:30893">
              수정하기
            </p>
          </div>
          <div className="cg125 cg5 cg6 cg7 cg35 cg48 cg167 cg9 cg168 cg10 cg11" data-node-id="336:30894" data-name="청파동 우리 집">
            <div className="cg9 cg10 cg117" data-node-id="436:16225" data-name="Icon/Locate">
              <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconLocate} />
            </div>
            <div className="cg12 cg5 cg6 cg13 cg14 cg15 cg8 cg16 cg17 cg18 cg48 cg9" data-node-id="336:30897" data-name="Label">
              <p className="cg37 cg9 cg10 cg21 cg162 cg11" data-node-id="336:30898">
                청파동 우리 집
              </p>
              <p className="cg25 cg20 cg9 cg10 cg26 cg71 cg23 cg11 cg24" data-node-id="336:30899">
                (01111) 서울특별시 용산구 청파동 래미안한강반포자이
              </p>
            </div>
          </div>
        </div>
        <div className="cg5 cg6 cg14 cg34 cg8 cg48 cg9 cg10 cg11" data-node-id="336:30900" data-name="Address section">
          <div className="cg5 cg6 cg35 cg57 cg9 cg10 cg11" data-node-id="336:30901">
            <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30902">
              활동 내역
            </p>
          </div>
          <div className="cg125 cg5 cg6 cg7 cg35 cg48 cg126 cg127 cg128 cg9 cg129 cg10 cg11" data-node-id="439:16269" data-name="List">
            <div className="cg9 cg10 cg117" data-node-id="I439:16269;355:7570" data-name="Icon/Write">
              <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconWrite} />
            </div>
            <div className="cg5 cg6 cg13 cg14 cg8 cg17 cg48 cg9" data-node-id="I439:16269;355:7566" data-name="Label">
              <p className="cg12 cg37 cg16 cg18 cg9 cg10 cg21 cg22 cg11" data-node-id="I439:16269;355:7567">
                내가 작성한 글
              </p>
            </div>
            <div className="cg9 cg10 cg130" data-node-id="I439:16269;419:5712" data-name="Icon/Arrow_Left">
              <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconArrowLeft} />
            </div>
          </div>
          <div className="cg125 cg5 cg6 cg7 cg35 cg48 cg126 cg127 cg128 cg9 cg129 cg10 cg11" data-node-id="439:16284" data-name="List">
            <div className="cg9 cg10 cg117" data-node-id="I439:16284;355:7570" data-name="Icon/Community">
              <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconCommunity} />
            </div>
            <div className="cg5 cg6 cg13 cg14 cg8 cg17 cg48 cg9" data-node-id="I439:16284;355:7566" data-name="Label">
              <p className="cg12 cg37 cg16 cg18 cg9 cg10 cg21 cg22 cg11" data-node-id="I439:16284;355:7567">
                댓글 단 글
              </p>
            </div>
            <div className="cg9 cg10 cg130" data-node-id="I439:16284;419:5712" data-name="Icon/Arrow_Left">
              <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconArrowLeft} />
            </div>
          </div>
          <div className="cg125 cg5 cg6 cg7 cg35 cg48 cg126 cg127 cg128 cg9 cg129 cg10 cg11" data-node-id="439:16292" data-name="List">
            <div className="cg9 cg10 cg117" data-node-id="I439:16292;355:7570" data-name="Icon/Book">
              <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconBook} />
            </div>
            <div className="cg5 cg6 cg13 cg14 cg8 cg17 cg48 cg9" data-node-id="I439:16292;355:7566" data-name="Label">
              <p className="cg12 cg37 cg16 cg18 cg9 cg10 cg21 cg22 cg11" data-node-id="I439:16292;355:7567">
                내가 해결한 문제
              </p>
            </div>
            <div className="cg9 cg10 cg130" data-node-id="I439:16292;419:5712" data-name="Icon/Arrow_Left">
              <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconArrowLeft} />
            </div>
          </div>
        </div>
        <div className="cg5 cg6 cg14 cg34 cg8 cg9 cg10 cg11" data-node-id="336:30924">
          <div className="cg12 cg5 cg6 cg35 cg57 cg18 cg9 cg10 cg11 cg24" data-node-id="336:30925">
            <p className="cg19 cg16 cg9 cg10 cg21 cg162" data-node-id="336:30926">
              최근 열람한 사례
            </p>
            <p className="cg37 cg38 cg9 cg10 cg26 cg69" data-node-id="336:30927">
              더보기
            </p>
          </div>
          <div className="cg5 cg6 cg7 cg35 cg9 cg10 cg11" data-node-id="336:30928">
            <Component className="cg73 cg48 cg9 cg29 cg10 cg497" />
            <div className="cg73 cg48 cg9 cg29 cg10 cg497" data-node-id="441:16821">
              <div className="cg0 cg472 cg87 cg410 cg473" data-node-id="I441:16821;441:16417" data-name="3D / 싱크대 누수 · 투명 배경">
                <img alt="" className="cg0 cg2 cg3 cg33 cg31 cg4" src={img3D1} />
              </div>
              <div className="cg0 cg474 cg147 cg223 cg475 cg87 cg476 cg477 cg478" data-node-id="I441:16821;441:16418" />
              <div className="cg0 cg5 cg6 cg14 cg8 cg87 cg141 cg479 cg478" data-node-id="I441:16821;441:16419">
                <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg179 cg11" data-node-id="I441:16821;441:16420">
                  부엌
                </p>
                <div className="cg5 cg6 cg14 cg8 cg9 cg10 cg11" data-node-id="I441:16821;441:16421">
                  <p className="cg12 cg19 cg16 cg18 cg20 cg9 cg10 cg59 cg179 cg23 cg11" data-node-id="I441:16821;441:16422">
                    냉장고 온도 조절
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="cg5 cg6 cg14 cg189 cg8 cg9 cg10 cg11" data-node-id="1047:18196">
          <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg22 cg24" data-node-id="1047:18197">
            데이터
          </p>
          <div className="cg5 cg6 cg14 cg189 cg8 cg9 cg10 cg11" data-node-id="1047:18198">
            <div className="cg12 cg5 cg6 cg25 cg334 cg35 cg16 cg18 cg386 cg9 cg10 cg21 cg11" data-node-id="1047:18199">
              <p className="cg13 cg17 cg9 cg22" data-node-id="1047:18200">
                앱 버전
              </p>
              <p className="cg20 cg9 cg10 cg27 cg23 cg495 cg498 cg24" data-node-id="1047:18201">
                v 1.0.0
              </p>
            </div>
            <div className="cg5 cg6 cg334 cg35 cg386 cg9 cg10 cg11" data-node-id="1047:18202">
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg22 cg499" data-node-id="1047:18203">
                개인정보 및 데이터 관리
              </p>
            </div>
            <div className="cg5 cg6 cg334 cg35 cg386 cg9 cg10 cg11" data-node-id="1047:18204">
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg22 cg499" data-node-id="1047:18205">
                이용약관
              </p>
            </div>
            <div className="cg5 cg6 cg334 cg35 cg386 cg9 cg10 cg11" data-node-id="1047:18206">
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg22 cg499" data-node-id="1047:18207">
                개인정보 처리방침
              </p>
            </div>
            <div className="cg5 cg6 cg334 cg35 cg386 cg9 cg10 cg11" data-node-id="1047:18208">
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg22 cg499" data-node-id="1047:18209">
                서비스 제공 방식
              </p>
            </div>
            <div className="cg5 cg6 cg334 cg35 cg386 cg9 cg10 cg11" data-node-id="1047:18210">
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg22 cg499" data-node-id="1047:18211">
                문의하기
              </p>
            </div>
          </div>
        </div>
        <div className="cg5 cg6 cg14 cg34 cg8 cg9 cg10 cg11" data-node-id="336:30945">
          <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30946">
            회원 관리
          </p>
          <div className="cg5 cg6 cg14 cg34 cg8 cg9 cg10 cg11" data-node-id="336:30947">
            <div className="cg5 cg6 cg35 cg427 cg9 cg10 cg11" data-node-id="336:30948">
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg499" data-node-id="336:30949">
                비밀번호 변경
              </p>
            </div>
            <div className="cg5 cg6 cg35 cg427 cg9 cg10 cg11" data-node-id="336:30950">
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg499" data-node-id="336:30951">
                로그아웃
              </p>
            </div>
            <div className="cg5 cg6 cg35 cg427 cg9 cg10 cg11" data-node-id="336:30952">
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg461 cg499" data-node-id="336:30953">
                회원 탈퇴
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="cg0 cg138 cg5 cg6 cg14 cg8 cg87 cg140 cg136 cg141 cg410" data-node-id="355:6449" data-name="Navigation Bar">
        <div className="cg5 cg6 cg111 cg143 cg35 cg48 cg144 cg9 cg129 cg145 cg10 cg11" data-node-id="I355:6449;355:6343" data-name="Navigation Bar">
          <div aria-hidden className="cg0 cg146 cg2 cg31 cg129" />
          <div className="cg5 cg6 cg111 cg149 cg35 cg40 cg48 cg150 cg151 cg9 cg115 cg10 cg116" data-node-id="I355:6449;355:6344" data-name="커뮤니티">
            <IconHome className="cg9 cg10 cg122" />
          </div>
          <div className="cg5 cg6 cg111 cg149 cg35 cg40 cg48 cg150 cg151 cg9 cg115 cg10 cg116" data-node-id="I355:6449;411:4107" data-name="해결 방법">
            <IconBook className="cg9 cg10 cg122" />
          </div>
          <div className="cg5 cg6 cg111 cg149 cg35 cg40 cg48 cg150 cg151 cg9 cg115 cg10 cg116" data-node-id="I355:6449;355:6350" data-name="마이">
            <IconCommunity className="cg9 cg10 cg117" />
          </div>
          <div className="cg147 cg5 cg6 cg13 cg148 cg149 cg35 cg57 cg17 cg48 cg150 cg151 cg9 cg115 cg152" data-node-id="I355:6449;355:6353" data-name="홈">
            <div className="cg9 cg10 cg122" data-node-id="I355:6449;355:7491" data-name="Icon/Profile">
              <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconProfile} />
            </div>
            <div className="cg5 cg6 cg13 cg14 cg35 cg40 cg17 cg9" data-node-id="I355:6449;355:6356">
              <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg69 cg153 cg11" data-node-id="I355:6449;355:6357">
                마이
              </p>
            </div>
          </div>
          <div className="cg0 cg2 cg31 cg123 cg154" />
        </div>
      </div>
    </div>
  );
}
