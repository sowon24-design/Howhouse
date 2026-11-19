// @ts-nocheck
// Figma 336:29043: C05-4 검색결과. Exact supplied artwork and copy; interactive adaptation is in Scene.tsx.
import imgImage from '../assets/0a97a155-85fa-4147-ae26-db599c6bdda0.png'
import imgIconHeart from '../assets/4c4c7c15-94b0-4f3a-921a-438b69c4dd13.svg'
import imgIconCommunity from '../assets/92366a40-0b90-407c-8528-2392c1ba1fee.svg'
import imgLine4 from '../assets/38b6ff73-bde0-4039-b377-a1b46970984d.svg'
import imgSize24 from '../assets/014db1ea-7103-4cd4-8e33-cad2f7f1c313.svg'
import imgStatusBar from '../assets/180fe36a-72a7-4086-b076-ea3a9b839e7b.svg'
import imgIconXMark from '../assets/025414c5-47c5-478c-877f-0535d4972c42.svg'
import imgIconXMark1 from '../assets/10d0235e-8811-4c54-85dd-b6d5368ff46b.svg'
import imgIconArrow from '../assets/32fef5b2-2a30-4cf6-a715-3615f9d9f965.svg'

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

type IconArrowLeftProps = {
  className?: string;
  size?: "24";
};

function IconArrowLeft({ className, size = "24" }: IconArrowLeftProps) {
  return (
    <div className={className || "cg9 cg117"} data-node-id="408:3502">
      <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgSize24} />
    </div>
  );
}

export default function C054() {
  return (
    <div className="cg47 cg5 cg6 cg14 cg8 cg48 cg9 cg50 cg4" data-node-id="336:29043" data-name="C05-4 검색결과">
      <div className="cg47 cg5 cg6 cg14 cg51 cg52 cg35 cg53 cg9 cg10 cg11" data-node-id="336:29044" data-name="상단바">
        <div className="cg0 cg47 cg2" data-node-id="336:29045" />
        <div className="cg54 cg9 cg10 cg55" data-node-id="336:29046" data-name="status bar">
          <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgStatusBar} />
        </div>
      </div>
      <div className="cg47 cg5 cg6 cg56 cg35 cg57 cg48 cg58 cg9 cg10 cg11" data-node-id="414:4895" data-name="GNB">
        <IconArrowLeft className="cg9 cg10 cg117" />
        <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg59 cg22 cg24" data-node-id="I414:4895;411:4466">
          검색 결과
        </p>
        <div className="cg9 cg10 cg117" data-node-id="I414:4895;411:4479" data-name="Icon/X-mark">
          <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconXMark} />
        </div>
      </div>
      <div className="cg5 cg6 cg14 cg253 cg8 cg48 cg254 cg63 cg255 cg9 cg10 cg11" data-node-id="336:29077" data-name="Community / Content">
        <div className="cg125 cg5 cg6 cg7 cg56 cg35 cg48 cg112 cg9 cg160 cg10 cg11" data-node-id="431:14576" data-name="Search">
          <p className="cg12 cg13 cg25 cg16 cg17 cg18 cg9 cg21 cg22" data-node-id="I431:14576;431:14499">
            꿀팁
          </p>
          <div className="cg9 cg10 cg36" data-node-id="I431:14576;431:14509" data-name="Icon/X-mark">
            <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconXMark1} />
          </div>
        </div>
        <div className="cg5 cg6 cg14 cg243 cg8 cg9 cg10 cg11" data-node-id="336:29082">
          <div className="cg12 cg19 cg66 cg18 cg9 cg10 cg59 cg162 cg163" data-node-id="336:29083">
            <p className="cg244">
              <span className="cg16">‘</span>
              <span className="cg16 cg69">꿀팁</span>
              <span className="cg16">’에 대한 검색 결과가</span>
            </p>
            <p className="cg16">총 2건 있어요.</p>
          </div>
          <div className="cg5 cg6 cg14 cg15 cg8 cg9 cg10 cg11" data-node-id="336:29084">
            <div className="cg5 cg6 cg409 cg35 cg9 cg10 cg11" data-node-id="462:4928" data-name="Categories">
              <div className="cg220 cg5 cg6 cg8 cg48 cg257 cg258 cg9 cg113 cg393 cg10" data-node-id="462:4929" data-name="Chip">
                <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg179 cg24" data-node-id="I462:4929;458:4816">
                  전체
                </p>
              </div>
              <div className="cg190 cg5 cg6 cg8 cg48 cg257 cg258 cg9 cg113 cg393 cg10" data-node-id="462:4930" data-name="Chip">
                <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="I462:4930;450:17929">
                  도움 요청
                </p>
              </div>
              <div className="cg190 cg5 cg6 cg8 cg48 cg257 cg258 cg9 cg113 cg393 cg10" data-node-id="462:4931" data-name="Chip">
                <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="I462:4931;450:17929">
                  자취 팁
                </p>
              </div>
              <div className="cg190 cg5 cg6 cg8 cg48 cg257 cg258 cg9 cg113 cg393 cg10" data-node-id="462:4932" data-name="Chip">
                <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="I462:4932;450:17929">
                  수리 책임
                </p>
              </div>
              <div className="cg190 cg5 cg6 cg8 cg48 cg257 cg258 cg9 cg113 cg393 cg10" data-node-id="462:4933" data-name="Chip">
                <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="I462:4933;450:17929">
                  해결 후기
                </p>
              </div>
              <div className="cg190 cg5 cg6 cg8 cg48 cg257 cg258 cg9 cg113 cg393 cg10" data-node-id="462:4934" data-name="Chip">
                <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="I462:4934;450:17929">
                  기타
                </p>
              </div>
            </div>
            <div className="cg5 cg6 cg35 cg212 cg48 cg9 cg10 cg11" data-node-id="336:29098" data-name="Categories">
              <div className="cg5 cg6 cg8 cg48 cg258 cg9 cg113 cg10" data-node-id="336:29099" data-name="자취 팁">
                <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="336:29100">
                  인기 순
                </p>
                <div className="cg6 cg35 cg40 cg9 cg10 cg130" data-node-id="336:29101">
                  <div className="cg42 cg43">
                    <div className="cg9 cg130" data-name="Icon / arrow">
                      <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconArrow} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="cg5 cg6 cg14 cg7 cg8 cg48 cg9 cg10 cg11" data-node-id="336:29103" data-name="Community / Solid list">
              <NavigationBarCommunityPost className="cg132 cg133 cg134 cg5 cg6 cg14 cg7 cg8 cg48 cg135 cg136 cg9 cg10 cg11" />
              <NavigationBarCommunityPost className="cg132 cg133 cg134 cg5 cg6 cg14 cg7 cg8 cg48 cg135 cg136 cg9 cg10 cg11" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
