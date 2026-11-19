// @ts-nocheck
// Figma 336:30189: C04-3 글 상세_신고 사유_완료. Exact supplied artwork and copy; interactive adaptation is in Scene.tsx.
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

export default function C043() {
  return (
    <div className="cg47 cg5 cg6 cg14 cg8 cg48 cg236 cg9 cg50 cg4" data-node-id="336:30189" data-name="C04-3 글 상세_신고 사유_완료">
      <div className="cg47 cg5 cg6 cg14 cg51 cg52 cg35 cg53 cg9 cg10 cg11" data-node-id="336:30190" data-name="상단바">
        <div className="cg0 cg47 cg2" data-node-id="336:30191" />
        <div className="cg54 cg9 cg10 cg55" data-node-id="336:30192" data-name="status bar">
          <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgStatusBar} />
        </div>
      </div>
      <div className="cg47 cg5 cg6 cg56 cg35 cg57 cg48 cg58 cg9 cg10 cg11" data-node-id="414:4841" data-name="GNB">
        <IconArrowLeft className="cg9 cg10 cg117" />
        <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg59 cg22 cg24" data-node-id="I414:4841;411:4466">
          커뮤니티 글
        </p>
        <div className="cg9 cg10 cg117" data-node-id="I414:4841;411:4479" data-name="Icon/Blank" />
      </div>
      <div className="cg47 cg5 cg6 cg14 cg253 cg8 cg48 cg254 cg63 cg255 cg9 cg10 cg11" data-node-id="436:15375" data-name="Community / Content">
        <div className="cg5 cg6 cg14 cg72 cg8 cg48 cg9 cg10 cg11" data-node-id="436:15376" data-name="어쩌집 / Solid post / 2">
          <div className="cg5 cg6 cg52 cg35 cg57 cg9 cg10 cg11" data-node-id="436:15377">
            <div className="cg5 cg6 cg7 cg318 cg35 cg40 cg9 cg10" data-node-id="436:15378">
              <div className="cg416 cg417 cg5 cg6 cg14 cg318 cg35 cg40 cg48 cg9 cg418 cg10" data-node-id="1047:19214" data-name="Text">
                <div className="cg284 cg0 cg419 cg87 cg420 cg421" data-node-id="1047:19215" data-name="image 262">
                  <img alt="" className="cg0 cg2 cg3 cg33 cg31 cg4" src={imgImage262} />
                </div>
              </div>
              <div className="cg5 cg6 cg14 cg8 cg40 cg48 cg9 cg10" data-node-id="436:15381" data-name="Post metadata">
                <div className="cg5 cg6 cg8 cg9 cg10" data-node-id="436:15382">
                  <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg162 cg24" data-node-id="436:15383">
                    김서윤
                  </p>
                </div>
                <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="436:15384">
                  2시간 전
                </p>
              </div>
            </div>
            <div className="cg48 cg9 cg10 cg117" data-node-id="436:15385" data-name="Icon/Kebab">
              <div className="cg0 cg422" data-node-id="I436:15385;408:3894">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgGroup129} />
              </div>
            </div>
          </div>
          <div className="cg12 cg5 cg6 cg14 cg7 cg8 cg16 cg18 cg9 cg10 cg11" data-node-id="436:15386">
            <p className="cg19 cg20 cg9 cg10 cg59 cg162 cg23 cg24" data-node-id="436:15387">
              자취생 꿀팁!
            </p>
            <div className="cg5 cg6 cg14 cg25 cg34 cg8 cg9 cg10 cg423 cg21 cg11" data-node-id="436:15388">
              <p className="cg9 cg10 cg11" data-node-id="436:15389">
                수리 기사님을 부르기 전에 밸브 주변부터 사진으로 확인했어요. 같은 상황이라면 이 순서가 도움이 될 거예요.
              </p>
              <p className="cg9 cg10 cg11" data-node-id="436:15390">
                직접 해보니 한 번에 해결하려 하기보다 상태를 먼저 확인하고 순서대로 진행하는 게 가장 중요했어요. 비슷한 상황이라면 무리하지 않는 선에서 참고해보세요.
              </p>
            </div>
          </div>
          <div className="cg5 cg6 cg14 cg34 cg8 cg9 cg10 cg11" data-node-id="436:15391">
            <div className="cg5 cg6 cg14 cg424 cg131 cg313 cg258 cg9 cg310 cg10 cg11" data-node-id="436:15392" data-name="자취 팁">
              <div className="cg0 cg2 cg20 cg31 cg310">
                <img alt="" className="cg0 cg318 cg319 cg3 cg88 cg320" src={img} />
              </div>
            </div>
            <div className="cg326 cg5 cg6 cg14 cg131 cg313 cg258 cg9 cg310 cg10 cg11" data-node-id="436:15393" data-name="자취 팁">
              <div className="cg0 cg2 cg20 cg31 cg310">
                <img alt="" className="cg0 cg318 cg319 cg3 cg88 cg320" src={img} />
              </div>
            </div>
          </div>
          <div className="cg5 cg6 cg111 cg35 cg48 cg9 cg10 cg11" data-node-id="436:15394" data-name="Supplies">
            <div className="cg425 cg5 cg6 cg8 cg48 cg257 cg426 cg9 cg113 cg10" data-node-id="436:15395" data-name="마른 수건">
              <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg69 cg24" data-node-id="436:15396">
                #꿀팁
              </p>
            </div>
            <div className="cg425 cg5 cg6 cg8 cg48 cg257 cg426 cg9 cg113 cg10" data-node-id="436:15397" data-name="마른 수건">
              <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg69 cg24" data-node-id="436:15398">
                #생활팁
              </p>
            </div>
          </div>
          <div className="cg5 cg6 cg111 cg52 cg35 cg40 cg48 cg9 cg10 cg11" data-node-id="436:15399" data-name="Reactions">
            <div className="cg125 cg5 cg6 cg13 cg15 cg318 cg35 cg40 cg17 cg9 cg310" data-node-id="436:15400">
              <div className="cg9 cg10 cg130" data-node-id="436:15401" data-name="Icon/Heart">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconHeart} />
              </div>
              <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="436:15402">
                도움됐어요 6
              </p>
            </div>
            <div className="cg125 cg5 cg6 cg13 cg34 cg318 cg35 cg40 cg17 cg9 cg310" data-node-id="436:15403">
              <div className="cg9 cg10 cg130" data-node-id="436:15404" data-name="Icon/Community">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconCommunity} />
              </div>
              <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="436:15405">
                댓글 11
              </p>
            </div>
          </div>
        </div>
        <div className="cg44 cg9 cg10 cg11" data-node-id="436:15406">
          <div className="cg0 cg46">
            <img alt="" className="cg1 cg3 cg4" src={imgLine4} />
          </div>
        </div>
        <div className="cg5 cg6 cg14 cg34 cg8 cg9 cg10 cg11" data-node-id="436:15407" data-name="Section">
          <div className="cg5 cg6 cg131 cg57 cg9 cg10 cg11" data-node-id="436:15408" data-name="Container">
            <div className="cg5 cg6 cg14 cg8 cg9 cg10" data-node-id="436:15409" data-name="Container">
              <div className="cg5 cg6 cg14 cg8 cg9 cg10 cg11" data-node-id="436:15410" data-name="Text">
                <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg59 cg162 cg24" data-node-id="436:15411">
                  댓글
                </p>
              </div>
            </div>
          </div>
          <div className="cg5 cg6 cg14 cg34 cg8 cg427 cg9 cg10 cg11" data-node-id="436:15412" data-name="Article:margin">
            <div className="cg5 cg6 cg8 cg57 cg9 cg10 cg11" data-node-id="436:15413">
              <div className="cg5 cg6 cg13 cg7 cg8 cg17 cg9 cg30" data-node-id="436:15414">
                <div className="cg417 cg5 cg6 cg14 cg35 cg40 cg48 cg9 cg446 cg10 cg117" data-node-id="436:15415" data-name="Text">
                  <div className="cg0 cg447 cg448 cg449 cg450" data-node-id="436:15416" data-name="image 8">
                    <img alt="" className="cg0 cg2 cg3 cg33 cg31 cg4" src={imgImage8} />
                  </div>
                </div>
                <div className="cg5 cg6 cg13 cg14 cg8 cg40 cg17 cg9" data-node-id="436:15417">
                  <div className="cg5 cg6 cg35 cg57 cg9 cg10 cg11" data-node-id="436:15418">
                    <div className="cg5 cg6 cg15 cg35 cg48 cg9 cg10" data-node-id="436:15419" data-name="Post metadata">
                      <div className="cg5 cg6 cg8 cg9 cg10" data-node-id="436:15420">
                        <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg162 cg24" data-node-id="436:15421">
                          김서윤
                        </p>
                      </div>
                      <div className="cg6 cg39 cg35 cg40 cg9 cg10 cg41" data-node-id="436:15422">
                        <div className="cg42 cg43">
                          <div className="cg44 cg9 cg45">
                            <div className="cg0 cg46">
                              <img alt="" className="cg1 cg3 cg4" src={imgLine3} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="436:15423">
                        2시간 전
                      </p>
                    </div>
                    <div className="cg48 cg9 cg10 cg130" data-node-id="436:15424" data-name="Icon/Kebab">
                      <div className="cg0 cg422" data-node-id="I436:15424;408:3899">
                        <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgGroup130} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg423 cg21 cg11" data-node-id="436:15425">
              직접 해보니 한 번에 해결하려 하기보다 상태를 먼저 확인하고 순서대로 진행하는 게 가장 중요했어요. 비슷한 상황이라면 무리하지 않는 선에서 참고해보세요.
            </p>
          </div>
          <div className="cg5 cg6 cg14 cg34 cg8 cg427 cg9 cg10 cg11" data-node-id="436:15426" data-name="Article:margin">
            <div className="cg5 cg6 cg8 cg57 cg9 cg10 cg11" data-node-id="436:15427">
              <div className="cg5 cg6 cg13 cg7 cg8 cg17 cg9 cg30" data-node-id="436:15428">
                <div className="cg417 cg5 cg6 cg14 cg35 cg40 cg48 cg9 cg446 cg10 cg117" data-node-id="436:15429" data-name="Text">
                  <div className="cg0 cg447 cg448 cg449 cg450" data-node-id="436:15430" data-name="image 8">
                    <img alt="" className="cg0 cg2 cg3 cg33 cg31 cg4" src={imgImage8} />
                  </div>
                </div>
                <div className="cg5 cg6 cg13 cg14 cg8 cg40 cg17 cg9" data-node-id="436:15431">
                  <div className="cg5 cg6 cg35 cg57 cg9 cg10 cg11" data-node-id="436:15432">
                    <div className="cg5 cg6 cg15 cg35 cg48 cg9 cg10" data-node-id="436:15433" data-name="Post metadata">
                      <div className="cg5 cg6 cg8 cg9 cg10" data-node-id="436:15434">
                        <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg162 cg24" data-node-id="436:15435">
                          김서윤
                        </p>
                      </div>
                      <div className="cg6 cg39 cg35 cg40 cg9 cg10 cg41" data-node-id="436:15436">
                        <div className="cg42 cg43">
                          <div className="cg44 cg9 cg45">
                            <div className="cg0 cg46">
                              <img alt="" className="cg1 cg3 cg4" src={imgLine3} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="436:15437">
                        2시간 전
                      </p>
                    </div>
                    <div className="cg48 cg9 cg10 cg130" data-node-id="436:15438" data-name="Icon/Kebab">
                      <div className="cg0 cg422" data-node-id="I436:15438;408:3899">
                        <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgGroup130} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg423 cg21 cg11" data-node-id="436:15439">
              직접 해보니 한 번에 해결하려 하기보다 상태를 먼저 확인하고 순서대로 진행하는 게 가장 중요했어요. 비슷한 상황이라면 무리하지 않는 선에서 참고해보세요.
            </p>
          </div>
        </div>
      </div>
      <div className="cg0 cg428 cg164 cg429 cg430 cg134 cg5 cg431 cg6 cg34 cg143 cg35 cg432 cg433 cg434 cg435 cg427 cg436 cg457 cg437" data-node-id="336:30303" data-name="CommunityDetail">
        <p className="cg12 cg13 cg25 cg16 cg17 cg18 cg9 cg21 cg71" data-node-id="336:30304">
          댓글을 입력해주세요
        </p>
        <div className="cg438 cg5 cg6 cg14 cg35 cg40 cg9 cg29 cg10 cg439" data-node-id="336:30305" data-name="Button">
          <div className="cg6 cg35 cg40 cg9 cg10 cg117" data-node-id="336:30306">
            <div className="cg458 cg42">
              <div className="cg9 cg117" data-name="akar-icons:send">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgAkarIconsSend} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cg0 cg249 cg2" data-node-id="336:30308" />
      <div className="cg0 cg47 cg138 cg5 cg6 cg14 cg180 cg35 cg87 cg48 cg236 cg237 cg58 cg410 cg238 cg239" data-node-id="336:30309" data-name="신고하기">
        <div className="cg241 cg242 cg9 cg129 cg10 cg170" data-node-id="336:30310" />
        <div className="cg5 cg6 cg14 cg64 cg35 cg9 cg10 cg11" data-node-id="336:30311">
          <div className="cg12 cg5 cg6 cg14 cg15 cg35 cg40 cg16 cg18 cg9 cg10 cg11" data-node-id="336:30312">
            <p className="cg19 cg9 cg10 cg59 cg162 cg24" data-node-id="336:30313">
              신고하기
            </p>
            <p className="cg25 cg186 cg9 cg10 cg245 cg26 cg153 cg187" data-node-id="336:30314">
              부적절한 게시물이나 권리 침해 콘텐츠를 신고합니다.
            </p>
          </div>
          <div className="cg5 cg6 cg14 cg8 cg9 cg10 cg11" data-node-id="336:30315">
            <div className="cg5 cg6 cg34 cg35 cg427 cg9 cg10 cg11" data-node-id="336:30316">
              <Radio className="cg387 cg132 cg134 cg9 cg129 cg10 cg130" property1={false} />
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30318">
                개인정보 또는 사생활 침해
              </p>
            </div>
            <div className="cg5 cg6 cg34 cg35 cg427 cg9 cg10 cg11" data-node-id="336:30319">
              <Radio className="cg387 cg132 cg134 cg9 cg129 cg10 cg130" property1={false} />
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30321">
                욕설 · 비방 · 괴롭힘
              </p>
            </div>
            <div className="cg5 cg6 cg34 cg35 cg427 cg9 cg10 cg11" data-node-id="336:30322">
              <Radio className="cg387 cg132 cg134 cg9 cg129 cg10 cg130" property1={false} />
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30324">
                허위 정보 또는 오해를 유발하는 내용
              </p>
            </div>
            <div className="cg5 cg6 cg34 cg35 cg427 cg9 cg10 cg11" data-node-id="336:30325">
              <Radio className="cg387 cg132 cg134 cg9 cg129 cg10 cg130" property1={false} />
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30327">
                광고 · 도배 · 스팸
              </p>
            </div>
            <div className="cg5 cg6 cg34 cg35 cg427 cg9 cg10 cg11" data-node-id="336:30328">
              <Radio className="cg387 cg132 cg134 cg9 cg129 cg10 cg130" property1={false} />
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30330">
                불법 콘텐츠 또는 기타 권리 침해
              </p>
            </div>
            <div className="cg5 cg6 cg34 cg35 cg427 cg9 cg10 cg11" data-node-id="336:30331">
              <Radio className="cg387 cg132 cg134 cg9 cg129 cg10 cg130" property1={false} />
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30333">
                음란 · 선정성
              </p>
            </div>
            <div className="cg5 cg6 cg34 cg35 cg427 cg9 cg10 cg11" data-node-id="336:30334">
              <div className="cg9 cg10 cg130" data-node-id="336:30335" data-name="Radio">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgRadio} />
              </div>
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30336">
                직접 입력하기
              </p>
            </div>
            <div className="cg5 cg6 cg14 cg8 cg460 cg9 cg10 cg11" data-node-id="336:30337">
              <div className="cg125 cg5 cg6 cg149 cg35 cg57 cg48 cg257 cg258 cg9 cg310 cg10 cg11" data-node-id="336:30338" data-name="자취 팁">
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30339">
                  그냥
                </p>
                <div className="cg5 cg6 cg14 cg404 cg8 cg48 cg9 cg10" data-node-id="336:30340" data-name="Ratio">
                  <div className="cg6 cg13 cg35 cg40 cg259 cg9 cg405" data-node-id="I336:30340;16215:17329">
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
        <div className="cg220 cg5 cg6 cg56 cg35 cg40 cg48 cg150 cg219 cg9 cg29 cg10 cg11" data-node-id="450:17639" data-name="Button">
          <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg121 cg24" data-node-id="I450:17639;441:17129">
            신고 완료하기
          </p>
        </div>
      </div>
    </div>
  );
}
