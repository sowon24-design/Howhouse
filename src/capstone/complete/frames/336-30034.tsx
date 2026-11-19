// @ts-nocheck
// Figma 336:30034: C04-2 글 상세_신고 사유_직접 입력. Exact supplied artwork and copy; interactive adaptation is in Scene.tsx.
import imgProperty1On from '../assets/8294c3bb-75d8-4b45-853f-713b5ad7d7ce.svg'
import imgSize24 from '../assets/014db1ea-7103-4cd4-8e33-cad2f7f1c313.svg'
import imgImage262 from '../assets/27871bc8-3b7b-4c6a-a0f5-b028e717f6b2.png'
import img from '../assets/03b8f0cc-f79a-4cbb-851d-8b496a4b68ef.png'
import imgImage8 from '../assets/0477c8a2-7310-4ed6-8997-21f19c997e46.png'
import imgStatusBar from '../assets/180fe36a-72a7-4086-b076-ea3a9b839e7b.svg'
import imgGroup129 from '../assets/0864eb7d-6b41-441f-b773-105d530c8792.svg'
import imgIconHeart from '../assets/2a763ad6-d48f-40c2-971c-ecef0a919afc.svg'
import imgIconCommunity from '../assets/02c37777-b075-4212-98d2-4a39a2ef3f53.svg'
import imgLine4 from '../assets/03de48fd-40ad-4325-a5b0-1b3cce4725fe.svg'
import imgLine3 from '../assets/2824260d-1694-407f-b8f3-ee81c4813252.svg'
import imgGroup130 from '../assets/05c22104-1355-45cb-bec0-0c8e708b7e56.svg'
import imgAkarIconsSend from '../assets/286c6bbf-b7a8-466c-97b9-4bc430282519.svg'
import imgRadio from '../assets/a185b1cc-5354-4731-a50b-1f45f70cac08.svg'
import imgRatio from '../assets/10654123-77dd-4f82-8121-2071c19a3fe2.svg'

type RadioProps = {
  className?: string;
  property1?: boolean;
};

function Radio({ className, property1 = true }: RadioProps) {
  const isNotProperty1 = !property1;
  return (
    <div className={className || `relative size-[20px] ${isNotProperty1 ? "border border-[var(--homecare-line,#d7dee7)] border-solid overflow-clip rounded-[100px]" : ""}`} id={isNotProperty1 ? "node-259_25553" : "node-259_25551"}>
      {property1 && <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgProperty1On} />}
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

export default function C042() {
  return (
    <div className="cg47 cg5 cg6 cg14 cg8 cg48 cg236 cg9 cg50 cg4" data-node-id="336:30034" data-name="C04-2 글 상세_신고 사유_직접 입력">
      <div className="cg47 cg5 cg6 cg14 cg51 cg52 cg35 cg53 cg9 cg10 cg11" data-node-id="336:30035" data-name="상단바">
        <div className="cg0 cg47 cg2" data-node-id="336:30036" />
        <div className="cg54 cg9 cg10 cg55" data-node-id="336:30037" data-name="status bar">
          <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgStatusBar} />
        </div>
      </div>
      <div className="cg47 cg5 cg6 cg56 cg35 cg57 cg48 cg58 cg9 cg10 cg11" data-node-id="414:4835" data-name="GNB">
        <IconArrowLeft className="cg9 cg10 cg117" />
        <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg59 cg22 cg24" data-node-id="I414:4835;411:4466">
          커뮤니티 글
        </p>
        <div className="cg9 cg10 cg117" data-node-id="I414:4835;411:4479" data-name="Icon/Blank" />
      </div>
      <div className="cg47 cg5 cg6 cg14 cg253 cg8 cg48 cg254 cg63 cg255 cg9 cg10 cg11" data-node-id="436:15294" data-name="Community / Content">
        <div className="cg5 cg6 cg14 cg72 cg8 cg48 cg9 cg10 cg11" data-node-id="436:15295" data-name="어쩌집 / Solid post / 2">
          <div className="cg5 cg6 cg52 cg35 cg57 cg9 cg10 cg11" data-node-id="436:15296">
            <div className="cg5 cg6 cg7 cg318 cg35 cg40 cg9 cg10" data-node-id="436:15297">
              <div className="cg416 cg417 cg5 cg6 cg14 cg318 cg35 cg40 cg48 cg9 cg418 cg10" data-node-id="1047:19217" data-name="Text">
                <div className="cg284 cg0 cg419 cg87 cg420 cg421" data-node-id="1047:19218" data-name="image 262">
                  <img alt="" className="cg0 cg2 cg3 cg33 cg31 cg4" src={imgImage262} />
                </div>
              </div>
              <div className="cg5 cg6 cg14 cg8 cg40 cg48 cg9 cg10" data-node-id="436:15300" data-name="Post metadata">
                <div className="cg5 cg6 cg8 cg9 cg10" data-node-id="436:15301">
                  <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg162 cg24" data-node-id="436:15302">
                    김서윤
                  </p>
                </div>
                <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="436:15303">
                  2시간 전
                </p>
              </div>
            </div>
            <div className="cg48 cg9 cg10 cg117" data-node-id="436:15304" data-name="Icon/Kebab">
              <div className="cg0 cg422" data-node-id="I436:15304;408:3894">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgGroup129} />
              </div>
            </div>
          </div>
          <div className="cg12 cg5 cg6 cg14 cg7 cg8 cg16 cg18 cg9 cg10 cg11" data-node-id="436:15305">
            <p className="cg19 cg20 cg9 cg10 cg59 cg162 cg23 cg24" data-node-id="436:15306">
              자취생 꿀팁!
            </p>
            <div className="cg5 cg6 cg14 cg25 cg34 cg8 cg9 cg10 cg423 cg21 cg11" data-node-id="436:15307">
              <p className="cg9 cg10 cg11" data-node-id="436:15308">
                수리 기사님을 부르기 전에 밸브 주변부터 사진으로 확인했어요. 같은 상황이라면 이 순서가 도움이 될 거예요.
              </p>
              <p className="cg9 cg10 cg11" data-node-id="436:15309">
                직접 해보니 한 번에 해결하려 하기보다 상태를 먼저 확인하고 순서대로 진행하는 게 가장 중요했어요. 비슷한 상황이라면 무리하지 않는 선에서 참고해보세요.
              </p>
            </div>
          </div>
          <div className="cg5 cg6 cg14 cg34 cg8 cg9 cg10 cg11" data-node-id="436:15310">
            <div className="cg5 cg6 cg14 cg424 cg131 cg313 cg258 cg9 cg310 cg10 cg11" data-node-id="436:15311" data-name="자취 팁">
              <div className="cg0 cg2 cg20 cg31 cg310">
                <img alt="" className="cg0 cg318 cg319 cg3 cg88 cg320" src={img} />
              </div>
            </div>
            <div className="cg326 cg5 cg6 cg14 cg131 cg313 cg258 cg9 cg310 cg10 cg11" data-node-id="436:15312" data-name="자취 팁">
              <div className="cg0 cg2 cg20 cg31 cg310">
                <img alt="" className="cg0 cg318 cg319 cg3 cg88 cg320" src={img} />
              </div>
            </div>
          </div>
          <div className="cg5 cg6 cg111 cg35 cg48 cg9 cg10 cg11" data-node-id="436:15313" data-name="Supplies">
            <div className="cg425 cg5 cg6 cg8 cg48 cg257 cg426 cg9 cg113 cg10" data-node-id="436:15314" data-name="마른 수건">
              <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg69 cg24" data-node-id="436:15315">
                #꿀팁
              </p>
            </div>
            <div className="cg425 cg5 cg6 cg8 cg48 cg257 cg426 cg9 cg113 cg10" data-node-id="436:15316" data-name="마른 수건">
              <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg69 cg24" data-node-id="436:15317">
                #생활팁
              </p>
            </div>
          </div>
          <div className="cg5 cg6 cg111 cg52 cg35 cg40 cg48 cg9 cg10 cg11" data-node-id="436:15318" data-name="Reactions">
            <div className="cg125 cg5 cg6 cg13 cg15 cg318 cg35 cg40 cg17 cg9 cg310" data-node-id="436:15319">
              <div className="cg9 cg10 cg130" data-node-id="436:15320" data-name="Icon/Heart">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconHeart} />
              </div>
              <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="436:15321">
                도움됐어요 6
              </p>
            </div>
            <div className="cg125 cg5 cg6 cg13 cg34 cg318 cg35 cg40 cg17 cg9 cg310" data-node-id="436:15322">
              <div className="cg9 cg10 cg130" data-node-id="436:15323" data-name="Icon/Community">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconCommunity} />
              </div>
              <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="436:15324">
                댓글 11
              </p>
            </div>
          </div>
        </div>
        <div className="cg44 cg9 cg10 cg11" data-node-id="436:15325">
          <div className="cg0 cg46">
            <img alt="" className="cg1 cg3 cg4" src={imgLine4} />
          </div>
        </div>
        <div className="cg5 cg6 cg14 cg34 cg8 cg9 cg10 cg11" data-node-id="436:15326" data-name="Section">
          <div className="cg5 cg6 cg131 cg57 cg9 cg10 cg11" data-node-id="436:15327" data-name="Container">
            <div className="cg5 cg6 cg14 cg8 cg9 cg10" data-node-id="436:15328" data-name="Container">
              <div className="cg5 cg6 cg14 cg8 cg9 cg10 cg11" data-node-id="436:15329" data-name="Text">
                <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg59 cg162 cg24" data-node-id="436:15330">
                  댓글
                </p>
              </div>
            </div>
          </div>
          <div className="cg5 cg6 cg14 cg34 cg8 cg427 cg9 cg10 cg11" data-node-id="436:15331" data-name="Article:margin">
            <div className="cg5 cg6 cg8 cg57 cg9 cg10 cg11" data-node-id="436:15332">
              <div className="cg5 cg6 cg13 cg7 cg8 cg17 cg9 cg30" data-node-id="436:15333">
                <div className="cg417 cg5 cg6 cg14 cg35 cg40 cg48 cg9 cg446 cg10 cg117" data-node-id="436:15334" data-name="Text">
                  <div className="cg0 cg447 cg448 cg449 cg450" data-node-id="436:15335" data-name="image 8">
                    <img alt="" className="cg0 cg2 cg3 cg33 cg31 cg4" src={imgImage8} />
                  </div>
                </div>
                <div className="cg5 cg6 cg13 cg14 cg8 cg40 cg17 cg9" data-node-id="436:15336">
                  <div className="cg5 cg6 cg35 cg57 cg9 cg10 cg11" data-node-id="436:15337">
                    <div className="cg5 cg6 cg15 cg35 cg48 cg9 cg10" data-node-id="436:15338" data-name="Post metadata">
                      <div className="cg5 cg6 cg8 cg9 cg10" data-node-id="436:15339">
                        <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg162 cg24" data-node-id="436:15340">
                          김서윤
                        </p>
                      </div>
                      <div className="cg6 cg39 cg35 cg40 cg9 cg10 cg41" data-node-id="436:15341">
                        <div className="cg42 cg43">
                          <div className="cg44 cg9 cg45">
                            <div className="cg0 cg46">
                              <img alt="" className="cg1 cg3 cg4" src={imgLine3} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="436:15342">
                        2시간 전
                      </p>
                    </div>
                    <div className="cg48 cg9 cg10 cg130" data-node-id="436:15343" data-name="Icon/Kebab">
                      <div className="cg0 cg422" data-node-id="I436:15343;408:3899">
                        <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgGroup130} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg423 cg21 cg11" data-node-id="436:15344">
              직접 해보니 한 번에 해결하려 하기보다 상태를 먼저 확인하고 순서대로 진행하는 게 가장 중요했어요. 비슷한 상황이라면 무리하지 않는 선에서 참고해보세요.
            </p>
          </div>
          <div className="cg5 cg6 cg14 cg34 cg8 cg427 cg9 cg10 cg11" data-node-id="436:15345" data-name="Article:margin">
            <div className="cg5 cg6 cg8 cg57 cg9 cg10 cg11" data-node-id="436:15346">
              <div className="cg5 cg6 cg13 cg7 cg8 cg17 cg9 cg30" data-node-id="436:15347">
                <div className="cg417 cg5 cg6 cg14 cg35 cg40 cg48 cg9 cg446 cg10 cg117" data-node-id="436:15348" data-name="Text">
                  <div className="cg0 cg447 cg448 cg449 cg450" data-node-id="436:15349" data-name="image 8">
                    <img alt="" className="cg0 cg2 cg3 cg33 cg31 cg4" src={imgImage8} />
                  </div>
                </div>
                <div className="cg5 cg6 cg13 cg14 cg8 cg40 cg17 cg9" data-node-id="436:15350">
                  <div className="cg5 cg6 cg35 cg57 cg9 cg10 cg11" data-node-id="436:15351">
                    <div className="cg5 cg6 cg15 cg35 cg48 cg9 cg10" data-node-id="436:15352" data-name="Post metadata">
                      <div className="cg5 cg6 cg8 cg9 cg10" data-node-id="436:15353">
                        <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg162 cg24" data-node-id="436:15354">
                          김서윤
                        </p>
                      </div>
                      <div className="cg6 cg39 cg35 cg40 cg9 cg10 cg41" data-node-id="436:15355">
                        <div className="cg42 cg43">
                          <div className="cg44 cg9 cg45">
                            <div className="cg0 cg46">
                              <img alt="" className="cg1 cg3 cg4" src={imgLine3} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="436:15356">
                        2시간 전
                      </p>
                    </div>
                    <div className="cg48 cg9 cg10 cg130" data-node-id="436:15357" data-name="Icon/Kebab">
                      <div className="cg0 cg422" data-node-id="I436:15357;408:3899">
                        <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgGroup130} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg423 cg21 cg11" data-node-id="436:15358">
              직접 해보니 한 번에 해결하려 하기보다 상태를 먼저 확인하고 순서대로 진행하는 게 가장 중요했어요. 비슷한 상황이라면 무리하지 않는 선에서 참고해보세요.
            </p>
          </div>
        </div>
      </div>
      <div className="cg0 cg428 cg164 cg429 cg430 cg134 cg5 cg431 cg6 cg34 cg143 cg35 cg432 cg433 cg434 cg435 cg427 cg436 cg457 cg437" data-node-id="336:30148" data-name="CommunityDetail">
        <p className="cg12 cg13 cg25 cg16 cg17 cg18 cg9 cg21 cg71" data-node-id="336:30149">
          댓글을 입력해주세요
        </p>
        <div className="cg438 cg5 cg6 cg14 cg35 cg40 cg9 cg29 cg10 cg439" data-node-id="336:30150" data-name="Button">
          <div className="cg6 cg35 cg40 cg9 cg10 cg117" data-node-id="336:30151">
            <div className="cg458 cg42">
              <div className="cg9 cg117" data-name="akar-icons:send">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgAkarIconsSend} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cg0 cg249 cg2" data-node-id="336:30153" />
      <div className="cg0 cg47 cg138 cg5 cg6 cg14 cg180 cg35 cg87 cg48 cg236 cg237 cg58 cg410 cg238 cg239" data-node-id="336:30154" data-name="신고하기">
        <div className="cg241 cg242 cg9 cg129 cg10 cg170" data-node-id="336:30155" />
        <div className="cg5 cg6 cg14 cg64 cg35 cg9 cg10 cg11" data-node-id="336:30156">
          <div className="cg12 cg5 cg6 cg14 cg15 cg35 cg40 cg16 cg18 cg9 cg10 cg11" data-node-id="336:30157">
            <p className="cg19 cg9 cg10 cg59 cg162 cg24" data-node-id="336:30158">
              신고하기
            </p>
            <p className="cg25 cg186 cg9 cg10 cg245 cg26 cg153 cg187" data-node-id="336:30159">
              부적절한 게시물이나 권리 침해 콘텐츠를 신고합니다.
            </p>
          </div>
          <div className="cg5 cg6 cg14 cg8 cg9 cg10 cg11" data-node-id="336:30160">
            <div className="cg5 cg6 cg34 cg35 cg427 cg9 cg10 cg11" data-node-id="336:30161">
              <Radio className="cg387 cg132 cg134 cg9 cg129 cg10 cg130" property1={false} />
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30163">
                개인정보 또는 사생활 침해
              </p>
            </div>
            <div className="cg5 cg6 cg34 cg35 cg427 cg9 cg10 cg11" data-node-id="336:30164">
              <Radio className="cg387 cg132 cg134 cg9 cg129 cg10 cg130" property1={false} />
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30166">
                욕설 · 비방 · 괴롭힘
              </p>
            </div>
            <div className="cg5 cg6 cg34 cg35 cg427 cg9 cg10 cg11" data-node-id="336:30167">
              <Radio className="cg387 cg132 cg134 cg9 cg129 cg10 cg130" property1={false} />
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30169">
                허위 정보 또는 오해를 유발하는 내용
              </p>
            </div>
            <div className="cg5 cg6 cg34 cg35 cg427 cg9 cg10 cg11" data-node-id="336:30170">
              <Radio className="cg387 cg132 cg134 cg9 cg129 cg10 cg130" property1={false} />
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30172">
                광고 · 도배 · 스팸
              </p>
            </div>
            <div className="cg5 cg6 cg34 cg35 cg427 cg9 cg10 cg11" data-node-id="336:30173">
              <Radio className="cg387 cg132 cg134 cg9 cg129 cg10 cg130" property1={false} />
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30175">
                불법 콘텐츠 또는 기타 권리 침해
              </p>
            </div>
            <div className="cg5 cg6 cg34 cg35 cg427 cg9 cg10 cg11" data-node-id="336:30176">
              <Radio className="cg387 cg132 cg134 cg9 cg129 cg10 cg130" property1={false} />
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30178">
                음란 · 선정성
              </p>
            </div>
            <div className="cg5 cg6 cg34 cg35 cg427 cg9 cg10 cg11" data-node-id="336:30179">
              <div className="cg9 cg10 cg130" data-node-id="336:30180" data-name="Radio">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgRadio} />
              </div>
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30181">
                직접 입력하기
              </p>
            </div>
            <div className="cg5 cg6 cg14 cg8 cg460 cg9 cg10 cg11" data-node-id="336:30182">
              <div className="cg125 cg5 cg6 cg149 cg35 cg57 cg48 cg257 cg258 cg9 cg310 cg10 cg11" data-node-id="336:30183" data-name="자취 팁">
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg71 cg24" data-node-id="336:30184">
                  신고 사유가 무엇인가요?
                </p>
                <div className="cg5 cg6 cg14 cg404 cg8 cg48 cg9 cg10" data-node-id="336:30185" data-name="Ratio">
                  <div className="cg6 cg13 cg35 cg40 cg259 cg9 cg405" data-node-id="I336:30185;16215:17329">
                    <div className="cg42 cg318 cg406">
                      <div className="cg318 cg9 cg407" data-name="Ratio">
                        <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgRatio} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="cg459 cg5 cg6 cg56 cg35 cg40 cg48 cg150 cg219 cg9 cg29 cg10 cg11" data-node-id="450:17636" data-name="Button">
          <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg121 cg24" data-node-id="I450:17636;441:17143">
            신고 완료하기
          </p>
        </div>
      </div>
    </div>
  );
}
