// @ts-nocheck
// Figma 336:32332: D14-5 회원탈퇴 완료. Exact supplied artwork and copy; interactive adaptation is in Scene.tsx.
import imgProperty1On from '../assets/18ec98e6-f583-4a9f-8cb4-2660f5978a9e.svg'
import imgSize24 from '../assets/014db1ea-7103-4cd4-8e33-cad2f7f1c313.svg'
import imgImage84 from '../assets/f4aeb090-85e4-45d0-af64-aaa7b7619987.png'
import imgStatusBar from '../assets/180fe36a-72a7-4086-b076-ea3a9b839e7b.svg'
import imgComponent2 from '../assets/075c6d79-f3b4-4046-8d3b-cc03309394ad.svg'
import imgRatio from '../assets/10654123-77dd-4f82-8121-2071c19a3fe2.svg'
import imgGroup from '../assets/10598a24-b65a-4d05-97ef-b2345736f8aa.svg'

type CheckboxProps = {
  className?: string;
  property1?: boolean;
};

function Checkbox({ className, property1 = true }: CheckboxProps) {
  const isNotProperty1 = !property1;
  return (
    <div className={className || `relative size-[20px] ${isNotProperty1 ? "bg-white border border-[var(--homecare-line,#d7dee7)] border-solid overflow-clip rounded-[4px]" : ""}`} id={isNotProperty1 ? "node-259_16375" : "node-259_16376"}>
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

export default function D145() {
  return (
    <div className="cg47 cg5 cg6 cg14 cg8 cg212 cg48 cg9 cg50 cg4" data-node-id="336:32332" data-name="D14-5 회원탈퇴 완료">
      <div className="cg5 cg6 cg14 cg51 cg52 cg35 cg53 cg9 cg10 cg11" data-node-id="336:32333" data-name="상단바">
        <div className="cg54 cg9 cg10 cg55" data-node-id="336:32335" data-name="status bar">
          <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgStatusBar} />
        </div>
      </div>
      <div className="cg47 cg5 cg6 cg56 cg35 cg57 cg48 cg177 cg9 cg10 cg11" data-node-id="414:5063" data-name="GNB">
        <IconArrowLeft className="cg9 cg10 cg117" />
        <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg59 cg22 cg24" data-node-id="I414:5063;411:4466">
          회원 탈퇴
        </p>
        <div className="cg9 cg10 cg117" data-node-id="I414:5063;411:4479" data-name="Icon/Blank" />
      </div>
      <div className="cg5 cg6 cg14 cg180 cg35 cg306 cg48 cg157 cg481 cg58 cg9 cg10 cg11" data-node-id="336:32366" data-name="Message / Content">
        <div className="cg5 cg6 cg14 cg243 cg8 cg9 cg10 cg11" data-node-id="336:32367">
          <div className="cg5 cg6 cg14 cg243 cg35 cg40 cg9 cg10 cg11" data-node-id="336:32368">
            <div className="cg5 cg6 cg14 cg8 cg48 cg9 cg10 cg11" data-node-id="336:32369" data-name="Related community">
              <div className="cg12 cg5 cg6 cg14 cg15 cg8 cg16 cg18 cg9 cg10 cg11 cg24" data-node-id="336:32370">
                <p className="cg19 cg9 cg10 cg59 cg162" data-node-id="336:32371">
                  회원 탈퇴 이유를 알려주세요.
                </p>
                <p className="cg25 cg9 cg10 cg21 cg68" data-node-id="336:32372">
                  더 나은 어쩌집을 만들 수 있도록 의견을 들려주세요.
                </p>
              </div>
            </div>
            <div className="cg5 cg6 cg14 cg8 cg9 cg10 cg11" data-node-id="336:32373">
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32374">
                <div className="cg9 cg10 cg130" data-node-id="336:32375" data-name="Component 2">
                  <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgComponent2} />
                </div>
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32376">
                  원하는 기능이 없어요.
                </p>
              </div>
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32377">
                <Checkbox className="cg190 cg387 cg132 cg134 cg9 cg526 cg10 cg130" property1={false} />
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32379">
                  사용하기 불편해요.
                </p>
              </div>
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32380">
                <Checkbox className="cg190 cg387 cg132 cg134 cg9 cg526 cg10 cg130" property1={false} />
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32382">
                  필요한 주거 정보가 부족해요.
                </p>
              </div>
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32383">
                <div className="cg9 cg10 cg130" data-node-id="336:32384" data-name="Component 2">
                  <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgComponent2} />
                </div>
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32385">
                  AI 답변이 만족스럽지 않아요.
                </p>
              </div>
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32386">
                <div className="cg9 cg10 cg130" data-node-id="336:32387" data-name="Component 2">
                  <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgComponent2} />
                </div>
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32388">
                  이용할 일이 별로 없어요.
                </p>
              </div>
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32389">
                <Checkbox className="cg190 cg387 cg132 cg134 cg9 cg526 cg10 cg130" property1={false} />
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32391">
                  개인정보 보호가 걱정돼요.
                </p>
              </div>
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32392">
                <Checkbox className="cg190 cg387 cg132 cg134 cg9 cg526 cg10 cg130" property1={false} />
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32394">
                  다른 서비스를 이용하려고 해요.
                </p>
              </div>
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32395">
                <div className="cg9 cg10 cg130" data-node-id="336:32396" data-name="Component 2">
                  <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgComponent2} />
                </div>
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32397">
                  직접 입력하기
                </p>
              </div>
              <div className="cg5 cg6 cg14 cg8 cg460 cg9 cg10 cg11" data-node-id="336:32398">
                <div className="cg500 cg5 cg6 cg149 cg35 cg57 cg48 cg257 cg258 cg9 cg200 cg10 cg11" data-node-id="336:32399" data-name="자취 팁">
                  <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32400">
                    더 쓸 가치가 없음.
                  </p>
                  <div className="cg5 cg6 cg14 cg404 cg8 cg48 cg9 cg10" data-node-id="336:32401" data-name="Ratio">
                    <div className="cg6 cg13 cg35 cg40 cg259 cg9 cg405" data-node-id="I336:32401;16215:17329">
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
          <div className="cg5 cg6 cg14 cg7 cg8 cg9 cg10 cg11" data-node-id="436:16184" data-name="유의사항 아코디언">
            <div className="cg132 cg133 cg134 cg5 cg6 cg149 cg35 cg57 cg256 cg48 cg9 cg10 cg11" data-node-id="436:16185" data-name="자취 팁">
              <div className="cg5 cg6 cg13 cg15 cg35 cg17 cg9" data-node-id="436:16186">
                <div className="cg48 cg9 cg10 cg36" data-node-id="436:16187" data-name="Icon/Warning">
                  <div className="cg0 cg214" data-node-id="I436:16187;408:3804" data-name="Group">
                    <div className="cg0 cg215">
                      <img alt="" className="cg1 cg3 cg4" src={imgGroup} />
                    </div>
                  </div>
                </div>
                <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="436:16188">
                  탈퇴 전 확인해 주세요.
                </p>
              </div>
            </div>
            <div className="cg12 cg5 cg6 cg14 cg25 cg34 cg8 cg66 cg18 cg9 cg10 cg245 cg26 cg11" data-node-id="436:16189">
              <ul className="cg1 cg9 cg10 cg11" data-node-id="436:16190">
                <li className="cg466 cg467">
                  <span className="cg16">탈퇴하면 계정 정보와 서비스 이용 권한이 삭제됩니다.</span>
                </li>
              </ul>
              <ul className="cg1 cg9 cg10 cg11" data-node-id="436:16191">
                <li className="cg466 cg467">
                  <span className="cg16">작성한 게시글과 댓글은 탈퇴 후에도 남을 수 있습니다. 삭제를 원한다면 탈퇴 전에 직접 삭제해 주세요.</span>
                </li>
              </ul>
              <ul className="cg1 cg9 cg10 cg11" data-node-id="436:16192">
                <li className="cg466 cg467">
                  <span className="cg16">삭제된 계정 정보는 복구할 수 없습니다.</span>
                </li>
              </ul>
              <ul className="cg1 cg9 cg10 cg11" data-node-id="436:16193">
                <li className="cg466 cg467">
                  <span className="cg16">관련 법령에 따라 보관이 필요한 정보는 해당 기간동안 보관될 수 있습니다.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="cg5 cg6 cg202 cg8 cg48 cg140 cg9 cg10 cg11" data-node-id="336:32403" data-name="Next action">
          <div className="cg220 cg5 cg6 cg13 cg56 cg35 cg40 cg17 cg48 cg150 cg219 cg9 cg29" data-node-id="450:17982" data-name="Button">
            <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg121 cg24" data-node-id="I450:17982;441:17129">
              계정 삭제하기
            </p>
          </div>
        </div>
      </div>
      <div className="cg0 cg249 cg2" data-node-id="336:32406" data-name="Modal scrim" />
      <div className="cg0 cg47 cg387 cg452 cg134 cg138 cg5 cg6 cg14 cg180 cg35 cg87 cg48 cg236 cg237 cg58 cg410 cg238 cg239" data-node-id="336:32407" data-name="Overlay">
        <div className="cg241 cg242 cg9 cg129 cg10 cg170" data-node-id="336:32408" />
        <div className="cg5 cg6 cg14 cg243 cg35 cg9 cg10 cg11" data-node-id="336:32409">
          <div className="cg5 cg6 cg14 cg35 cg9 cg10 cg11" data-node-id="336:32410">
            <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg59 cg68 cg153 cg24" data-node-id="336:32411">
              어쩌집 서비스를 이용해 주셔서 감사합니다.
            </p>
          </div>
          <div className="cg527 cg9 cg10 cg528" data-node-id="336:32412" data-name="image 84">
            <img alt="" className="cg0 cg2 cg3 cg529 cg31 cg4" src={imgImage84} />
          </div>
        </div>
        <div className="cg220 cg5 cg6 cg56 cg35 cg40 cg48 cg150 cg219 cg9 cg29 cg10 cg11" data-node-id="450:17659" data-name="Button">
          <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg121 cg24" data-node-id="I450:17659;441:17129">
            화면 나가기
          </p>
        </div>
      </div>
    </div>
  );
}
