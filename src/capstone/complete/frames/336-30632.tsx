// @ts-nocheck
// Figma 336:30632: C02-3 글쓰기_글 입력. Exact supplied artwork and copy; interactive adaptation is in Scene.tsx.
import imgGroup from '../assets/10598a24-b65a-4d05-97ef-b2345736f8aa.svg'
import imgIconArrowTop from '../assets/4554f0da-81e6-482f-871a-0cb005605d98.svg'
import imgPhoto from '../assets/03b8f0cc-f79a-4cbb-851d-8b496a4b68ef.png'
import imgIconXMark from '../assets/10d0235e-8811-4c54-85dd-b6d5368ff46b.svg'
import imgSize28 from '../assets/03d977da-30c8-4d1f-9fca-bc34a5f37780.svg'
import imgSize24 from '../assets/014db1ea-7103-4cd4-8e33-cad2f7f1c313.svg'
import imgStatusBar from '../assets/180fe36a-72a7-4086-b076-ea3a9b839e7b.svg'
import imgIconXMark1 from '../assets/90b067a8-b105-4faf-9f88-7014a07760e5.svg'

type ComponentProps = {
  className?: string;
  property1?: "Open";
};

function Component({ className, property1 = "Open" }: ComponentProps) {
  return (
    <div className={className || "cg5 cg6 cg14 cg7 cg8 cg9 cg163"} data-node-id="336:27390">
      <div className="cg132 cg133 cg134 cg5 cg6 cg149 cg35 cg57 cg256 cg48 cg9 cg10 cg11" data-node-id="336:27391" data-name="자취 팁">
        <div className="cg5 cg6 cg13 cg15 cg35 cg17 cg9" data-node-id="336:27392">
          <div className="cg48 cg9 cg10 cg36" data-node-id="436:14863" data-name="Icon/Warning">
            <div className="cg0 cg214" data-node-id="I436:14863;408:3804" data-name="Group">
              <div className="cg0 cg215">
                <img alt="" className="cg1 cg3 cg4" src={imgGroup} />
              </div>
            </div>
          </div>
          <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg22 cg24" data-node-id="336:27397">
            게시글 작성 전 확인해 주세요.
          </p>
        </div>
        <div className="cg9 cg10 cg130" data-node-id="436:14911" data-name="Icon/Arrow_Top">
          <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconArrowTop} />
        </div>
      </div>
      <div className="cg12 cg5 cg6 cg14 cg25 cg34 cg8 cg66 cg18 cg9 cg10 cg245 cg26 cg11" data-node-id="336:27400">
        <ul className="cg1 cg9 cg10 cg11" data-node-id="336:27401">
          <li className="cg466 cg467">
            <span className="cg16">이름, 전화번호, 주소 등 개인정보가 노출되지 않도록 주의해 주세요.</span>
          </li>
        </ul>
        <ul className="cg1 cg9 cg10 cg11" data-node-id="336:27402">
          <li className="cg466 cg467">
            <span className="cg16">집주인이나 타인의 신상을 공개하거나 비방하는 글은 작성하지 말아 주세요.</span>
          </li>
        </ul>
        <ul className="cg1 cg9 cg10 cg11" data-node-id="336:27403">
          <li className="cg466 cg467">
            <span className="cg16">확인되지 않은 정보나 잘못된 해결 방법은 사실인 것처럼 단정하지 말아 주세요.</span>
          </li>
        </ul>
        <ul className="cg1 cg9 cg10 cg11" data-node-id="336:27404">
          <li className="cg466 cg467">
            <span className="cg16">서로 다른 경험과 의견을 존중하며 예의를 지켜 주세요.</span>
          </li>
        </ul>
        <ul className="cg1 cg9 cg10 cg11" data-node-id="336:27405">
          <li className="cg466 cg467">
            <span className="cg16">사진을 첨부할 때는 개인정보나 타인의 사생활이 노출되지 않았는지 확인해 주세요.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function Photo({ className }: { className?: string }) {
  return (
    <div className={className || "cg5 cg6 cg14 cg131 cg48 cg313 cg258 cg9 cg29 cg314"} data-node-id="369:9358" data-name="Photo">
      <div className="cg0 cg2 cg20 cg31 cg29">
        <img alt="" className="cg0 cg318 cg319 cg3 cg88 cg320" src={imgPhoto} />
      </div>
      <div className="cg9 cg10 cg36" data-node-id="369:9355" data-name="Icon/X-mark">
        <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconXMark} />
      </div>
    </div>
  );
}

type IconPlusProps = {
  className?: string;
  size?: "28";
};

function IconPlus({ className, size = "28" }: IconPlusProps) {
  return (
    <div className={className || "cg9 cg122"} data-node-id="369:9168">
      <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgSize28} />
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

export default function C023() {
  return (
    <div className="cg47 cg5 cg6 cg14 cg8 cg48 cg9 cg50 cg4" data-node-id="336:30632" data-name="C02-3 글쓰기_글 입력">
      <div className="cg47 cg5 cg6 cg14 cg51 cg52 cg35 cg53 cg9 cg10 cg11" data-node-id="336:30633" data-name="상단바">
        <div className="cg0 cg47 cg2" data-node-id="336:30634" />
        <div className="cg54 cg9 cg10 cg55" data-node-id="336:30635" data-name="status bar">
          <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgStatusBar} />
        </div>
      </div>
      <div className="cg47 cg5 cg6 cg56 cg35 cg57 cg48 cg58 cg9 cg10 cg11" data-node-id="414:4799" data-name="GNB">
        <IconArrowLeft className="cg9 cg10 cg117" />
        <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg59 cg22 cg24" data-node-id="I414:4799;411:4466">
          글 작성하기
        </p>
        <div className="cg9 cg10 cg117" data-node-id="I414:4799;411:4479" data-name="Icon/Blank" />
      </div>
      <div className="cg5 cg6 cg14 cg180 cg8 cg48 cg254 cg63 cg255 cg9 cg10 cg11" data-node-id="336:30666" data-name="Community / Content">
        <div className="cg5 cg6 cg14 cg243 cg8 cg9 cg10" data-node-id="336:30667">
          <div className="cg5 cg6 cg14 cg34 cg8 cg9 cg10 cg155" data-node-id="336:30668" data-name="Related community">
            <div className="cg5 cg6 cg35 cg57 cg9 cg10 cg11" data-node-id="336:30669">
              <p className="cg12 cg19 cg66 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30670">
                <span className="cg16">{`글 유형 `}</span>
                <span className="cg16 cg461">*</span>
              </p>
            </div>
            <div className="cg462 cg6 cg205 cg409 cg35 cg9 cg10 cg11" data-node-id="458:4903" data-name="Categories">
              <div className="cg220 cg5 cg6 cg8 cg48 cg257 cg258 cg9 cg113 cg393 cg10" data-node-id="458:4904" data-name="Chip">
                <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg179 cg24" data-node-id="I458:4904;458:4816">
                  도움 요청
                </p>
              </div>
              <div className="cg190 cg5 cg6 cg8 cg48 cg257 cg258 cg9 cg113 cg393 cg10" data-node-id="458:4905" data-name="Chip">
                <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="I458:4905;450:17929">
                  자취 팁
                </p>
              </div>
              <div className="cg190 cg5 cg6 cg8 cg48 cg257 cg258 cg9 cg113 cg393 cg10" data-node-id="458:4906" data-name="Chip">
                <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="I458:4906;450:17929">
                  수리 책임
                </p>
              </div>
              <div className="cg190 cg5 cg6 cg8 cg48 cg257 cg258 cg9 cg113 cg393 cg10" data-node-id="458:4907" data-name="Chip">
                <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="I458:4907;450:17929">
                  해결 후기
                </p>
              </div>
              <div className="cg190 cg5 cg6 cg8 cg48 cg257 cg258 cg9 cg113 cg393 cg10" data-node-id="458:4908" data-name="Chip">
                <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="I458:4908;450:17929">
                  기타
                </p>
              </div>
            </div>
          </div>
          <div className="cg5 cg6 cg14 cg34 cg8 cg48 cg9 cg10 cg155" data-node-id="336:30682" data-name="Related community">
            <div className="cg5 cg6 cg35 cg57 cg9 cg10 cg11" data-node-id="336:30683">
              <p className="cg12 cg19 cg66 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30684">
                <span className="cg16">{`제목 `}</span>
                <span className="cg16 cg461">*</span>
              </p>
            </div>
            <div className="cg12 cg125 cg5 cg6 cg14 cg34 cg131 cg18 cg48 cg257 cg258 cg9 cg310 cg10 cg11" data-node-id="336:30685" data-name="자취 팁">
              <p className="cg25 cg16 cg463 cg186 cg9 cg10 cg21 cg162 cg187" data-node-id="336:30686">
                자취 후기 구합니다
              </p>
              <p className="cg37 cg38 cg9 cg10 cg464 cg26 cg24" data-node-id="336:30687">
                12/60
              </p>
            </div>
          </div>
          <div className="cg5 cg6 cg14 cg34 cg8 cg48 cg9 cg10 cg155" data-node-id="336:30688" data-name="Related community">
            <div className="cg5 cg6 cg35 cg57 cg9 cg10 cg11" data-node-id="336:30689">
              <p className="cg12 cg19 cg66 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30690">
                <span className="cg16">{`내용 `}</span>
                <span className="cg16 cg461">*</span>
              </p>
            </div>
            <div className="cg125 cg5 cg6 cg14 cg34 cg131 cg48 cg257 cg258 cg9 cg310 cg10 cg11" data-node-id="336:30691" data-name="자취 팁">
              <div className="cg5 cg6 cg14 cg35 cg40 cg468 cg465 cg48 cg9 cg10 cg11" data-node-id="450:17938">
                <div className="cg12 cg6 cg14 cg25 cg469 cg470 cg212 cg66 cg9 cg10 cg21 cg162 cg11 cg471" data-node-id="336:30692" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
                  <p className="cg16 cg244">{`수리 기사님을 부르기 전에 밸브 주변부터 사진으로 확인했어요. 같은 상황이라면 이 순서가 도움이 될 거예요. `}</p>
                  <p className="cg16 cg244">{` `}</p>
                  <p className="cg16 cg244">직접 해보니 한 번에 해결하려 하기보다 상태를 먼저 확인하고 순서대로 진행하는 게 가장 중요했어요. 비슷한 상황이라면 무리하지 않는 선에서 참고해보세요.</p>
                  <p className="cg16 cg244">​</p>
                  <p className="cg16 cg244">{`수리 기사님을 부르기 전에 밸브 주변부터 사진으로 확인했어요. 같은 상황이라면 이 순서가 도움이 될 거예요. `}</p>
                  <p className="cg16 cg244">{` `}</p>
                  <p className="cg16 cg244">직접 해보니 한 번에 해결하려 하기보다 상태를 먼저 확인하고 순서대로 진행하는 게 가장 중요했어요. 비슷한 상황이라면 무리하지 않는 선에서 참고해보세요.</p>
                  <p className="cg16 cg244">{`수리 기사님을 부르기 전에 밸브 주변부터 사진으로 확인했어요. 같은 상황이라면 이 순서가 도움이 될 거예요. `}</p>
                  <p className="cg16 cg244">{` `}</p>
                  <p className="cg16 cg244">직접 해보니 한 번에 해결하려 하기보다 상태를 먼저 확인하고 순서대로 진행하는 게 가장 중요했어요. 비슷한 상황이라면 무리하지 않는 선에서 참고해보세요.</p>
                  <p className="cg16 cg244">​</p>
                  <p className="cg16 cg244">{`수리 기사님을 부르기 전에 밸브 주변부터 사진으로 확인했어요. 같은 상황이라면 이 순서가 도움이 될 거예요. `}</p>
                  <p className="cg16 cg244">{` `}</p>
                  <p className="cg16">직접 해보니 한 번에 해결하려 하기보다 상태를 먼저 확인하고 순서대로 진행하는 게 가장 중요했어요. 비슷한 상황이라면 무리하지 않는 선에서 참고해보세요.</p>
                </div>
              </div>
              <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg464 cg26 cg24" data-node-id="336:30693">
                3/1000
              </p>
            </div>
          </div>
          <div className="cg5 cg6 cg14 cg34 cg8 cg48 cg9 cg10 cg155" data-node-id="336:30694" data-name="Related community">
            <div className="cg5 cg6 cg35 cg57 cg9 cg10 cg11" data-node-id="336:30695">
              <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30696">
                사진 첨부하기 (3/5)
              </p>
            </div>
            <div className="cg204 cg6 cg205 cg34 cg8 cg9 cg10 cg11" data-node-id="336:30697">
              <div className="cg125 cg5 cg6 cg14 cg35 cg40 cg48 cg313 cg258 cg9 cg29 cg10 cg314" data-node-id="462:9080" data-name="Add image">
                <IconPlus className="cg9 cg10 cg122" />
              </div>
              <Photo className="cg5 cg6 cg14 cg131 cg48 cg313 cg258 cg9 cg29 cg10 cg314" />
              <Photo className="cg5 cg6 cg14 cg131 cg48 cg313 cg258 cg9 cg29 cg10 cg314" />
              <Photo className="cg5 cg6 cg14 cg131 cg48 cg313 cg258 cg9 cg29 cg10 cg314" />
            </div>
          </div>
          <div className="cg5 cg6 cg14 cg34 cg8 cg48 cg9 cg10 cg155" data-node-id="336:30710" data-name="Related community">
            <div className="cg5 cg6 cg35 cg57 cg9 cg10 cg11" data-node-id="336:30711">
              <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30712">
                태그 (2/5)
              </p>
            </div>
            <div className="cg125 cg5 cg6 cg14 cg149 cg8 cg40 cg256 cg48 cg257 cg258 cg9 cg310 cg10 cg11" data-node-id="336:30713" data-name="자취 팁">
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg68 cg11" data-node-id="336:30714">
                글쓰는중
              </p>
            </div>
            <div className="cg204 cg6 cg205 cg34 cg8 cg9 cg10 cg11" data-node-id="336:30715">
              <div className="cg218 cg5 cg6 cg34 cg35 cg256 cg48 cg257 cg258 cg9 cg129 cg10" data-node-id="458:4697" data-name="태그">
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg69 cg24" data-node-id="I458:4697;450:17924">
                  누수
                </p>
                <div className="cg9 cg10 cg36" data-node-id="I458:4697;450:17925" data-name="Icon/X-mark">
                  <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconXMark1} />
                </div>
              </div>
              <div className="cg218 cg5 cg6 cg34 cg35 cg256 cg48 cg257 cg258 cg9 cg129 cg10" data-node-id="458:4692" data-name="태그">
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg69 cg24" data-node-id="I458:4692;450:17924">
                  곰팡이
                </p>
                <div className="cg9 cg10 cg36" data-node-id="I458:4692;450:17925" data-name="Icon/X-mark">
                  <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconXMark1} />
                </div>
              </div>
            </div>
          </div>
          <Component className="cg5 cg6 cg14 cg7 cg8 cg9 cg10 cg155" />
        </div>
        <div className="cg5 cg6 cg202 cg8 cg48 cg140 cg9 cg10 cg11" data-node-id="336:30725" data-name="Next action">
          <div className="cg220 cg5 cg6 cg13 cg56 cg35 cg40 cg17 cg48 cg150 cg219 cg9 cg29" data-node-id="450:17919" data-name="Button">
            <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg121 cg24" data-node-id="I450:17919;441:17129">
              글 올리기
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
