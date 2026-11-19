// @ts-nocheck
// Figma 336:32244: D14-4 회원탈퇴 확인. Exact supplied artwork and copy; interactive adaptation is in Scene.tsx.
import imgProperty1On from '../assets/18ec98e6-f583-4a9f-8cb4-2660f5978a9e.svg'
import imgSize24 from '../assets/014db1ea-7103-4cd4-8e33-cad2f7f1c313.svg'
import imgStatusBar from '../assets/180fe36a-72a7-4086-b076-ea3a9b839e7b.svg'
import imgComponent2 from '../assets/075c6d79-f3b4-4046-8d3b-cc03309394ad.svg'
import imgRatio from '../assets/10654123-77dd-4f82-8121-2071c19a3fe2.svg'
import imgGroup from '../assets/10598a24-b65a-4d05-97ef-b2345736f8aa.svg'
import imgGroup1 from '../assets/37bf4b59-7670-466b-8f5f-8ab240e82cca.svg'

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

export default function D144() {
  return (
    <div className="cg47 cg5 cg6 cg14 cg8 cg212 cg48 cg9 cg50 cg4" data-node-id="336:32244" data-name="D14-4 회원탈퇴 확인">
      <div className="cg5 cg6 cg14 cg51 cg52 cg35 cg53 cg9 cg10 cg11" data-node-id="336:32245" data-name="상단바">
        <div className="cg54 cg9 cg10 cg55" data-node-id="336:32247" data-name="status bar">
          <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgStatusBar} />
        </div>
      </div>
      <div className="cg47 cg5 cg6 cg56 cg35 cg57 cg48 cg177 cg9 cg10 cg11" data-node-id="414:5057" data-name="GNB">
        <IconArrowLeft className="cg9 cg10 cg117" />
        <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg59 cg22 cg24" data-node-id="I414:5057;411:4466">
          회원 탈퇴
        </p>
        <div className="cg9 cg10 cg117" data-node-id="I414:5057;411:4479" data-name="Icon/Blank" />
      </div>
      <div className="cg5 cg6 cg14 cg180 cg35 cg306 cg48 cg157 cg481 cg58 cg9 cg10 cg11" data-node-id="336:32278" data-name="Message / Content">
        <div className="cg5 cg6 cg14 cg243 cg8 cg9 cg10 cg11" data-node-id="336:32279">
          <div className="cg5 cg6 cg14 cg243 cg35 cg40 cg9 cg10 cg11" data-node-id="336:32280">
            <div className="cg5 cg6 cg14 cg8 cg48 cg9 cg10 cg11" data-node-id="336:32281" data-name="Related community">
              <div className="cg12 cg5 cg6 cg14 cg15 cg8 cg16 cg18 cg9 cg10 cg11 cg24" data-node-id="336:32282">
                <p className="cg19 cg9 cg10 cg59 cg162" data-node-id="336:32283">
                  회원 탈퇴 이유를 알려주세요.
                </p>
                <p className="cg25 cg9 cg10 cg21 cg68" data-node-id="336:32284">
                  더 나은 어쩌집을 만들 수 있도록 의견을 들려주세요.
                </p>
              </div>
            </div>
            <div className="cg5 cg6 cg14 cg8 cg9 cg10 cg11" data-node-id="336:32285">
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32286">
                <div className="cg9 cg10 cg130" data-node-id="336:32287" data-name="Component 2">
                  <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgComponent2} />
                </div>
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32288">
                  원하는 기능이 없어요.
                </p>
              </div>
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32289">
                <Checkbox className="cg190 cg387 cg132 cg134 cg9 cg526 cg10 cg130" property1={false} />
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32291">
                  사용하기 불편해요.
                </p>
              </div>
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32292">
                <Checkbox className="cg190 cg387 cg132 cg134 cg9 cg526 cg10 cg130" property1={false} />
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32294">
                  필요한 주거 정보가 부족해요.
                </p>
              </div>
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32295">
                <div className="cg9 cg10 cg130" data-node-id="336:32296" data-name="Component 2">
                  <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgComponent2} />
                </div>
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32297">
                  AI 답변이 만족스럽지 않아요.
                </p>
              </div>
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32298">
                <div className="cg9 cg10 cg130" data-node-id="336:32299" data-name="Component 2">
                  <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgComponent2} />
                </div>
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32300">
                  이용할 일이 별로 없어요.
                </p>
              </div>
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32301">
                <Checkbox className="cg190 cg387 cg132 cg134 cg9 cg526 cg10 cg130" property1={false} />
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32303">
                  개인정보 보호가 걱정돼요.
                </p>
              </div>
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32304">
                <Checkbox className="cg190 cg387 cg132 cg134 cg9 cg526 cg10 cg130" property1={false} />
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32306">
                  다른 서비스를 이용하려고 해요.
                </p>
              </div>
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32307">
                <div className="cg9 cg10 cg130" data-node-id="336:32308" data-name="Component 2">
                  <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgComponent2} />
                </div>
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32309">
                  직접 입력하기
                </p>
              </div>
              <div className="cg5 cg6 cg14 cg8 cg460 cg9 cg10 cg11" data-node-id="336:32310">
                <div className="cg500 cg5 cg6 cg149 cg35 cg57 cg48 cg257 cg258 cg9 cg200 cg10 cg11" data-node-id="336:32311" data-name="자취 팁">
                  <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32312">
                    더 쓸 가치가 없음.
                  </p>
                  <div className="cg5 cg6 cg14 cg404 cg8 cg48 cg9 cg10" data-node-id="336:32313" data-name="Ratio">
                    <div className="cg6 cg13 cg35 cg40 cg259 cg9 cg405" data-node-id="I336:32313;16215:17329">
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
          <div className="cg5 cg6 cg14 cg7 cg8 cg9 cg10 cg11" data-node-id="436:16169" data-name="유의사항 아코디언">
            <div className="cg132 cg133 cg134 cg5 cg6 cg149 cg35 cg57 cg256 cg48 cg9 cg10 cg11" data-node-id="436:16170" data-name="자취 팁">
              <div className="cg5 cg6 cg13 cg15 cg35 cg17 cg9" data-node-id="436:16171">
                <div className="cg48 cg9 cg10 cg36" data-node-id="436:16172" data-name="Icon/Warning">
                  <div className="cg0 cg214" data-node-id="I436:16172;408:3804" data-name="Group">
                    <div className="cg0 cg215">
                      <img alt="" className="cg1 cg3 cg4" src={imgGroup} />
                    </div>
                  </div>
                </div>
                <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="436:16173">
                  탈퇴 전 확인해 주세요.
                </p>
              </div>
            </div>
            <div className="cg12 cg5 cg6 cg14 cg25 cg34 cg8 cg66 cg18 cg9 cg10 cg245 cg26 cg11" data-node-id="436:16174">
              <ul className="cg1 cg9 cg10 cg11" data-node-id="436:16175">
                <li className="cg466 cg467">
                  <span className="cg16">탈퇴하면 계정 정보와 서비스 이용 권한이 삭제됩니다.</span>
                </li>
              </ul>
              <ul className="cg1 cg9 cg10 cg11" data-node-id="436:16176">
                <li className="cg466 cg467">
                  <span className="cg16">작성한 게시글과 댓글은 탈퇴 후에도 남을 수 있습니다. 삭제를 원한다면 탈퇴 전에 직접 삭제해 주세요.</span>
                </li>
              </ul>
              <ul className="cg1 cg9 cg10 cg11" data-node-id="436:16177">
                <li className="cg466 cg467">
                  <span className="cg16">삭제된 계정 정보는 복구할 수 없습니다.</span>
                </li>
              </ul>
              <ul className="cg1 cg9 cg10 cg11" data-node-id="436:16178">
                <li className="cg466 cg467">
                  <span className="cg16">관련 법령에 따라 보관이 필요한 정보는 해당 기간동안 보관될 수 있습니다.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="cg5 cg6 cg202 cg8 cg48 cg140 cg9 cg10 cg11" data-node-id="336:32315" data-name="Next action">
          <div className="cg220 cg5 cg6 cg13 cg56 cg35 cg40 cg17 cg48 cg150 cg219 cg9 cg29" data-node-id="450:17978" data-name="Button">
            <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg121 cg24" data-node-id="I450:17978;441:17129">
              계정 삭제하기
            </p>
          </div>
        </div>
      </div>
      <div className="cg0 cg249 cg2" data-node-id="336:32318" data-name="Modal scrim" />
      <div className="cg284 cg0 cg47 cg387 cg452 cg134 cg5 cg6 cg14 cg243 cg35 cg432 cg48 cg58 cg159 cg436 cg113 cg453" data-node-id="436:15982" data-name="Overlay">
        <div className="cg48 cg9 cg10 cg122" data-node-id="I436:15982;436:15889" data-name="Icon/Warning">
          <div className="cg0 cg214" data-node-id="I436:15982;436:15889;408:3792" data-name="Group">
            <div className="cg0 cg454">
              <img alt="" className="cg1 cg3 cg4" src={imgGroup1} />
            </div>
          </div>
        </div>
        <div className="cg12 cg5 cg6 cg14 cg34 cg35 cg40 cg16 cg18 cg48 cg9 cg10 cg11" data-node-id="I436:15982;436:15880" data-name="Step heading">
          <p className="cg19 cg9 cg10 cg59 cg68 cg24" data-node-id="I436:15982;436:15881">
            정말 탈퇴할까요?
          </p>
          <p className="cg25 cg186 cg9 cg10 cg245 cg26 cg153 cg187" data-node-id="I436:15982;436:15882">
            계정 정보를 다시 되돌릴 수 없어요.
          </p>
        </div>
        <div className="cg5 cg6 cg7 cg8 cg48 cg9 cg10 cg11" data-node-id="I436:15982;450:17677" data-name="Next action">
          <div className="cg218 cg5 cg6 cg13 cg56 cg35 cg40 cg17 cg48 cg150 cg219 cg9 cg29" data-node-id="I436:15982;450:17678" data-name="Button">
            <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg22 cg24" data-node-id="I436:15982;450:17678;441:17195">
              아니오
            </p>
          </div>
          <div className="cg220 cg5 cg6 cg13 cg56 cg35 cg40 cg17 cg48 cg150 cg219 cg9 cg29" data-node-id="I436:15982;450:17679" data-name="Button">
            <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg121 cg24" data-node-id="I436:15982;450:17679;441:17129">
              네
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
