// @ts-nocheck
// Figma 336:28651: C01 커뮤니티. Exact supplied artwork and copy; interactive adaptation is in Scene.tsx.
import imgSize28StyleFill from '../assets/03c75980-d870-4c43-a989-934c8aabc326.svg'
import imgSize28StyleFill1 from '../assets/1f326d16-1146-49e9-8566-671b3a5b23a5.svg'
import imgSize28StyleFill2 from '../assets/80b4b59c-3f50-44a6-9d1e-63f4bbc36349.svg'
import imgImage from '../assets/0a97a155-85fa-4147-ae26-db599c6bdda0.png'
import imgIconHeart from '../assets/45837d26-18ac-49bf-8c3b-517402929838.svg'
import imgIconCommunity from '../assets/197c9790-a19c-4a1f-a520-7daadf5de4dc.svg'
import imgLine4 from '../assets/38b6ff73-bde0-4039-b377-a1b46970984d.svg'
import imgStatusBar from '../assets/180fe36a-72a7-4086-b076-ea3a9b839e7b.svg'
import imgIconSearch from '../assets/c39af75f-86db-4b04-8e44-9e867fd18e91.svg'
import imgIconArrow from '../assets/32fef5b2-2a30-4cf6-a715-3615f9d9f965.svg'
import imgIconCommunity1 from '../assets/eedc01c2-4fce-47d8-b445-684100a336cf.svg'
import imgIconWrite from '../assets/08c6e12a-a265-4ba7-8acd-c8b354d1de09.svg'

type IconProfileProps = {
  className?: string;
  size?: "28";
  style?: "Fill";
};

function IconProfile({ className, size = "28", style = "Fill" }: IconProfileProps) {
  return (
    <div className={className || "cg9 cg122"} data-node-id="355:7472">
      <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgSize28StyleFill} />
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
      <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgSize28StyleFill1} />
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
      <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgSize28StyleFill2} />
    </div>
  );
}

type NavigationBarCommunityPostProps = {
  className?: string;
  boolean?: boolean;
};

function NavigationBarCommunityPost({ className, boolean = true }: NavigationBarCommunityPostProps) {
  return (
    <div className={className || "cg132 cg133 cg134 cg5 cg6 cg14 cg7 cg8 cg48 cg135 cg136 cg9 cg155"} data-node-id="355:8265" data-name="Navigation Bar/Community_Post">
      <div className="cg5 cg6 cg7 cg8 cg9 cg10 cg11" data-node-id="355:8259">
        <div className="cg12 cg5 cg6 cg13 cg14 cg15 cg8 cg16 cg17 cg18 cg9" data-node-id="355:8240">
          <p className="cg19 cg20 cg9 cg10 cg21 cg22 cg23 cg11 cg24" data-node-id="355:8241">
            자취생 꿀팁!
          </p>
          <p className="cg25 cg20 cg9 cg10 cg26 cg27 cg23 cg11" data-node-id="355:8242">
            생활용품은 조금씩! 꼭 필요한 것부터 하나씩 채워보세요. 한 번에 많이 사두는 것은 자취생한테 금물!! 어차피 쓰지도 못한답니다.
          </p>
        </div>
        {boolean && (
          <div className="cg28 cg9 cg29 cg30 cg10" data-node-id="355:8257" data-name="Image (햇빛이 드는 창가와 화분)">
            <div aria-hidden className="cg0 cg2 cg31 cg29">
              <div className="cg0 cg32 cg2 cg29" />
              <img alt="" className="cg0 cg3 cg33 cg29 cg4" src={imgImage} />
            </div>
          </div>
        )}
      </div>
      <div className="cg5 cg6 cg34 cg35 cg9 cg10" data-node-id="355:8542">
        <div className="cg5 cg6 cg15 cg35 cg9 cg10" data-node-id="355:8571">
          <div className="cg9 cg10 cg36" data-node-id="369:9051" data-name="Icon/Heart">
            <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconHeart} />
          </div>
          <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg27 cg24" data-node-id="355:8566">
            6
          </p>
        </div>
        <div className="cg5 cg6 cg15 cg35 cg9 cg10" data-node-id="355:8583">
          <div className="cg9 cg10 cg36" data-node-id="355:8620" data-name="Icon/Community">
            <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconCommunity} />
          </div>
          <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg27 cg24" data-node-id="355:8578">
            11
          </p>
        </div>
        <div className="cg6 cg39 cg35 cg40 cg9 cg10 cg41" data-node-id="355:8594">
          <div className="cg42 cg43">
            <div className="cg44 cg9 cg45">
              <div className="cg0 cg46">
                <img alt="" className="cg1 cg3 cg4" src={imgLine4} />
              </div>
            </div>
          </div>
        </div>
        <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg27 cg24" data-node-id="355:8588">
          2시간 전
        </p>
        <div className="cg6 cg39 cg35 cg40 cg9 cg10 cg41" data-node-id="355:8544">
          <div className="cg42 cg43">
            <div className="cg44 cg9 cg45">
              <div className="cg0 cg46">
                <img alt="" className="cg1 cg3 cg4" src={imgLine4} />
              </div>
            </div>
          </div>
        </div>
        <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg27 cg24" data-node-id="355:8591">
          김서윤
        </p>
      </div>
    </div>
  );
}

export default function C01() {
  return (
    <div className="cg47 cg5 cg6 cg14 cg8 cg48 cg9 cg50 cg4" data-node-id="336:28651" data-name="C01 커뮤니티">
      <div className="cg47 cg5 cg6 cg14 cg51 cg52 cg35 cg53 cg9 cg10 cg11" data-node-id="336:28652" data-name="상단바">
        <div className="cg0 cg47 cg2" data-node-id="336:28653" />
        <div className="cg54 cg9 cg10 cg55" data-node-id="336:28654" data-name="status bar">
          <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgStatusBar} />
        </div>
      </div>
      <div className="cg47 cg5 cg6 cg56 cg35 cg57 cg48 cg58 cg9 cg10 cg11" data-node-id="414:4765" data-name="GNB">
        <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg59 cg22 cg24" data-node-id="I414:4765;411:4585">
          자취생들의 이야기
        </p>
      </div>
      <div className="cg5 cg6 cg14 cg253 cg8 cg48 cg254 cg63 cg255 cg9 cg10 cg11" data-node-id="336:28681" data-name="Community / Content">
        <div className="cg125 cg5 cg6 cg52 cg35 cg57 cg48 cg112 cg9 cg160 cg10 cg11" data-node-id="336:28682" data-name="Write post">
          <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg161 cg21 cg24" data-node-id="336:28683">
            찾는 글이 있나요?
          </p>
          <div className="cg9 cg10 cg408" data-node-id="336:28684" data-name="Icon / search">
            <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconSearch} />
          </div>
        </div>
        <div className="cg5 cg6 cg14 cg34 cg8 cg9 cg10 cg11" data-node-id="336:28686">
          <div className="cg5 cg6 cg409 cg35 cg9 cg10 cg11" data-node-id="458:4854" data-name="Categories">
            <div className="cg220 cg5 cg6 cg8 cg48 cg257 cg258 cg9 cg113 cg393 cg10" data-node-id="458:4855" data-name="Chip">
              <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg179 cg24" data-node-id="I458:4855;458:4816">
                전체
              </p>
            </div>
            <div className="cg190 cg5 cg6 cg8 cg48 cg257 cg258 cg9 cg113 cg393 cg10" data-node-id="458:4856" data-name="Chip">
              <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="I458:4856;450:17929">
                도움 요청
              </p>
            </div>
            <div className="cg190 cg5 cg6 cg8 cg48 cg257 cg258 cg9 cg113 cg393 cg10" data-node-id="458:4857" data-name="Chip">
              <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="I458:4857;450:17929">
                자취 팁
              </p>
            </div>
            <div className="cg190 cg5 cg6 cg8 cg48 cg257 cg258 cg9 cg113 cg393 cg10" data-node-id="458:4858" data-name="Chip">
              <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="I458:4858;450:17929">
                수리 책임
              </p>
            </div>
            <div className="cg190 cg5 cg6 cg8 cg48 cg257 cg258 cg9 cg113 cg393 cg10" data-node-id="458:4859" data-name="Chip">
              <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="I458:4859;450:17929">
                해결 후기
              </p>
            </div>
            <div className="cg190 cg5 cg6 cg8 cg48 cg257 cg258 cg9 cg113 cg393 cg10" data-node-id="458:4860" data-name="Chip">
              <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="I458:4860;450:17929">
                기타
              </p>
            </div>
          </div>
          <div className="cg5 cg6 cg14 cg15 cg8 cg9 cg10 cg11" data-node-id="336:28700">
            <div className="cg5 cg6 cg35 cg212 cg48 cg9 cg10 cg11" data-node-id="336:28701" data-name="Categories">
              <div className="cg5 cg6 cg8 cg48 cg258 cg9 cg113 cg10" data-node-id="336:28702" data-name="자취 팁">
                <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="336:28703">
                  인기 순
                </p>
                <div className="cg6 cg35 cg40 cg9 cg10 cg130" data-node-id="336:28704">
                  <div className="cg42 cg43">
                    <div className="cg9 cg130" data-name="Icon / arrow">
                      <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconArrow} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="cg5 cg6 cg14 cg7 cg8 cg48 cg9 cg10 cg11" data-node-id="336:28706" data-name="Community / Solid list">
              <NavigationBarCommunityPost className="cg132 cg133 cg134 cg5 cg6 cg14 cg7 cg8 cg48 cg135 cg136 cg9 cg10 cg11" />
              <div className="cg132 cg133 cg134 cg5 cg6 cg14 cg7 cg8 cg48 cg135 cg136 cg9 cg10 cg11" data-node-id="355:8684" data-name="Navigation Bar/Community_Post">
                <div className="cg5 cg6 cg7 cg8 cg9 cg10 cg11" data-node-id="I355:8684;355:8259">
                  <div className="cg12 cg5 cg6 cg13 cg14 cg15 cg8 cg16 cg17 cg18 cg9" data-node-id="I355:8684;355:8240">
                    <p className="cg19 cg20 cg9 cg10 cg21 cg22 cg23 cg11 cg24" data-node-id="I355:8684;355:8241">
                      자취생 꿀팁!
                    </p>
                    <p className="cg25 cg20 cg9 cg10 cg26 cg27 cg23 cg11" data-node-id="I355:8684;355:8242">
                      생활용품은 조금씩! 꼭 필요한 것부터 하나씩 채워보세요. 한 번에 많이 사두는 것은 자취생한테 금물!! 어차피 쓰지도 못한답니다.
                    </p>
                  </div>
                  <div className="cg28 cg9 cg29 cg30 cg10" data-node-id="I355:8684;355:8257" data-name="Image (햇빛이 드는 창가와 화분)">
                    <div aria-hidden className="cg0 cg2 cg31 cg29">
                      <div className="cg0 cg32 cg2 cg29" />
                      <img alt="" className="cg0 cg3 cg33 cg29 cg4" src={imgImage} />
                    </div>
                  </div>
                </div>
                <div className="cg5 cg6 cg34 cg35 cg9 cg10" data-node-id="I355:8684;355:8542">
                  <div className="cg5 cg6 cg15 cg35 cg9 cg10" data-node-id="I355:8684;355:8571">
                    <div className="cg9 cg10 cg36" data-node-id="I355:8684;369:9051" data-name="Icon/Heart">
                      <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconHeart} />
                    </div>
                    <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg27 cg24" data-node-id="I355:8684;355:8566">
                      6
                    </p>
                  </div>
                  <div className="cg5 cg6 cg15 cg35 cg9 cg10" data-node-id="I355:8684;355:8583">
                    <div className="cg9 cg10 cg36" data-node-id="I355:8684;355:8620" data-name="Icon/Community">
                      <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconCommunity} />
                    </div>
                    <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg27 cg24" data-node-id="I355:8684;355:8578">
                      11
                    </p>
                  </div>
                  <div className="cg6 cg39 cg35 cg40 cg9 cg10 cg41" data-node-id="I355:8684;355:8594">
                    <div className="cg42 cg43">
                      <div className="cg44 cg9 cg45">
                        <div className="cg0 cg46">
                          <img alt="" className="cg1 cg3 cg4" src={imgLine4} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg27 cg24" data-node-id="I355:8684;355:8588">
                    2시간 전
                  </p>
                  <div className="cg6 cg39 cg35 cg40 cg9 cg10 cg41" data-node-id="I355:8684;355:8544">
                    <div className="cg42 cg43">
                      <div className="cg44 cg9 cg45">
                        <div className="cg0 cg46">
                          <img alt="" className="cg1 cg3 cg4" src={imgLine4} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg27 cg24" data-node-id="I355:8684;355:8591">
                    김서윤
                  </p>
                </div>
              </div>
              <NavigationBarCommunityPost className="cg132 cg133 cg134 cg5 cg6 cg14 cg7 cg8 cg48 cg135 cg136 cg9 cg10 cg11" />
              <NavigationBarCommunityPost className="cg132 cg133 cg134 cg5 cg6 cg14 cg7 cg8 cg48 cg135 cg136 cg9 cg10 cg11" />
            </div>
          </div>
        </div>
      </div>
      <div className="cg0 cg138 cg5 cg6 cg14 cg8 cg87 cg140 cg136 cg141 cg410" data-node-id="355:6587" data-name="Navigation Bar">
        <div className="cg5 cg6 cg111 cg143 cg35 cg48 cg144 cg9 cg129 cg145 cg10 cg11" data-node-id="I355:6587;355:6358" data-name="Navigation Bar">
          <div aria-hidden className="cg0 cg146 cg2 cg31 cg129" />
          <div className="cg5 cg6 cg111 cg149 cg35 cg40 cg48 cg150 cg151 cg9 cg115 cg10 cg116" data-node-id="I355:6587;355:6359" data-name="커뮤니티">
            <IconHome className="cg9 cg10 cg122" />
          </div>
          <div className="cg5 cg6 cg111 cg149 cg35 cg40 cg48 cg150 cg151 cg9 cg115 cg10 cg116" data-node-id="I355:6587;411:4088" data-name="해결 방법">
            <IconBook className="cg9 cg10 cg122" />
          </div>
          <div className="cg147 cg5 cg6 cg13 cg148 cg149 cg35 cg57 cg17 cg48 cg150 cg151 cg9 cg115 cg152" data-node-id="I355:6587;355:6365" data-name="홈">
            <div className="cg9 cg10 cg122" data-node-id="I355:6587;355:7482" data-name="Icon/Community">
              <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconCommunity1} />
            </div>
            <div className="cg5 cg6 cg13 cg14 cg35 cg40 cg17 cg9" data-node-id="I355:6587;355:6368">
              <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg69 cg153 cg11" data-node-id="I355:6587;355:6369">
                커뮤니티
              </p>
            </div>
          </div>
          <div className="cg5 cg6 cg111 cg149 cg35 cg40 cg48 cg150 cg151 cg9 cg115 cg10 cg116" data-node-id="I355:6587;355:6370" data-name="마이">
            <IconProfile className="cg9 cg10 cg122" />
          </div>
          <div className="cg0 cg2 cg31 cg123 cg154" />
        </div>
      </div>
      <div className="cg0 cg411 cg412 cg5 cg6 cg413 cg111 cg56 cg35 cg48 cg112 cg414 cg160 cg415" data-node-id="336:28711" data-name="Write post">
        <div className="cg9 cg10 cg117" data-node-id="431:14741" data-name="Icon/Write">
          <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconWrite} />
        </div>
        <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg179 cg24" data-node-id="336:28714">
          글쓰기
        </p>
      </div>
    </div>
  );
}
