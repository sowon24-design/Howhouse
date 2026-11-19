// @ts-nocheck
// Figma 336:32026: D14-1 회원탈퇴 안내. Exact supplied artwork and copy; interactive adaptation is in Scene.tsx.
import imgSize24 from '../assets/014db1ea-7103-4cd4-8e33-cad2f7f1c313.svg'
import imgStatusBar from '../assets/180fe36a-72a7-4086-b076-ea3a9b839e7b.svg'
import imgGroup from '../assets/10598a24-b65a-4d05-97ef-b2345736f8aa.svg'

type CheckboxProps = {
  className?: string;
  property1?: "off";
};

function Checkbox({ className, property1 = "off" }: CheckboxProps) {
  return <div className={className || "cg190 cg387 cg132 cg134 cg48 cg9 cg526 cg130"} data-node-id="259:16375" />;
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

export default function D141() {
  return (
    <div className="cg47 cg5 cg6 cg14 cg8 cg48 cg9 cg50 cg4" data-node-id="336:32026" data-name="D14-1 회원탈퇴 안내">
      <div className="cg5 cg6 cg14 cg51 cg52 cg35 cg53 cg9 cg10 cg11" data-node-id="336:32027" data-name="상단바">
        <div className="cg54 cg9 cg10 cg55" data-node-id="336:32029" data-name="status bar">
          <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgStatusBar} />
        </div>
      </div>
      <div className="cg47 cg5 cg6 cg56 cg35 cg57 cg48 cg177 cg9 cg10 cg11" data-node-id="414:5039" data-name="GNB">
        <IconArrowLeft className="cg9 cg10 cg117" />
        <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg59 cg22 cg24" data-node-id="I414:5039;411:4466">
          회원 탈퇴
        </p>
        <div className="cg9 cg10 cg117" data-node-id="I414:5039;411:4479" data-name="Icon/Blank" />
      </div>
      <div className="cg5 cg6 cg14 cg180 cg35 cg306 cg48 cg157 cg481 cg58 cg9 cg10 cg11" data-node-id="336:32060" data-name="Message / Content">
        <div className="cg5 cg6 cg14 cg243 cg8 cg9 cg10 cg11" data-node-id="336:32061">
          <div className="cg5 cg6 cg14 cg243 cg35 cg40 cg9 cg10 cg11" data-node-id="336:32062">
            <div className="cg5 cg6 cg14 cg8 cg48 cg9 cg10 cg11" data-node-id="336:32063" data-name="Related community">
              <div className="cg12 cg5 cg6 cg14 cg15 cg8 cg16 cg18 cg9 cg10 cg11" data-node-id="336:32064">
                <p className="cg19 cg9 cg10 cg59 cg162 cg11" data-node-id="336:32065">
                  회원 탈퇴 이유를 알려주세요.
                </p>
                <p className="cg25 cg9 cg10 cg21 cg68 cg11" data-node-id="336:32066">
                  더 나은 어쩌집을 만들 수 있도록 의견을 들려주세요.
                </p>
              </div>
            </div>
            <div className="cg5 cg6 cg14 cg8 cg9 cg10 cg11" data-node-id="336:32067">
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32068">
                <Checkbox className="cg190 cg387 cg132 cg134 cg9 cg526 cg10 cg130" />
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32070">
                  원하는 기능이 없어요.
                </p>
              </div>
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32071">
                <Checkbox className="cg190 cg387 cg132 cg134 cg9 cg526 cg10 cg130" />
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32073">
                  사용하기 불편해요.
                </p>
              </div>
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32074">
                <Checkbox className="cg190 cg387 cg132 cg134 cg9 cg526 cg10 cg130" />
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32076">
                  필요한 주거 정보가 부족해요.
                </p>
              </div>
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32077">
                <Checkbox className="cg190 cg387 cg132 cg134 cg9 cg526 cg10 cg130" />
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32079">
                  AI 답변이 만족스럽지 않아요.
                </p>
              </div>
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32080">
                <Checkbox className="cg190 cg387 cg132 cg134 cg9 cg526 cg10 cg130" />
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32082">
                  이용할 일이 별로 없어요.
                </p>
              </div>
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32083">
                <Checkbox className="cg190 cg387 cg132 cg134 cg9 cg526 cg10 cg130" />
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32085">
                  개인정보 보호가 걱정돼요.
                </p>
              </div>
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32086">
                <Checkbox className="cg190 cg387 cg132 cg134 cg9 cg526 cg10 cg130" />
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32088">
                  다른 서비스를 이용하려고 해요.
                </p>
              </div>
              <div className="cg5 cg6 cg34 cg35 cg494 cg9 cg10 cg11" data-node-id="336:32089">
                <Checkbox className="cg190 cg387 cg132 cg134 cg9 cg526 cg10 cg130" />
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:32091">
                  직접 입력하기
                </p>
              </div>
            </div>
          </div>
          <div className="cg5 cg6 cg14 cg7 cg8 cg9 cg10 cg11" data-node-id="436:16123" data-name="유의사항 아코디언">
            <div className="cg132 cg133 cg134 cg5 cg6 cg149 cg35 cg57 cg256 cg48 cg9 cg10 cg11" data-node-id="436:16124" data-name="자취 팁">
              <div className="cg5 cg6 cg13 cg15 cg35 cg17 cg9" data-node-id="436:16125">
                <div className="cg48 cg9 cg10 cg36" data-node-id="436:16126" data-name="Icon/Warning">
                  <div className="cg0 cg214" data-node-id="I436:16126;408:3804" data-name="Group">
                    <div className="cg0 cg215">
                      <img alt="" className="cg1 cg3 cg4" src={imgGroup} />
                    </div>
                  </div>
                </div>
                <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="436:16127">
                  탈퇴 전 확인해 주세요.
                </p>
              </div>
            </div>
            <div className="cg12 cg5 cg6 cg14 cg25 cg34 cg8 cg66 cg18 cg9 cg10 cg245 cg26 cg11" data-node-id="436:16129">
              <ul className="cg1 cg9 cg10 cg11" data-node-id="436:16130">
                <li className="cg466 cg467">
                  <span className="cg16">탈퇴하면 계정 정보와 서비스 이용 권한이 삭제됩니다.</span>
                </li>
              </ul>
              <ul className="cg1 cg9 cg10 cg11" data-node-id="436:16131">
                <li className="cg466 cg467">
                  <span className="cg16">작성한 게시글과 댓글은 탈퇴 후에도 남을 수 있습니다. 삭제를 원한다면 탈퇴 전에 직접 삭제해 주세요.</span>
                </li>
              </ul>
              <ul className="cg1 cg9 cg10 cg11" data-node-id="436:16132">
                <li className="cg466 cg467">
                  <span className="cg16">삭제된 계정 정보는 복구할 수 없습니다.</span>
                </li>
              </ul>
              <ul className="cg1 cg9 cg10 cg11" data-node-id="436:16133">
                <li className="cg466 cg467">
                  <span className="cg16">관련 법령에 따라 보관이 필요한 정보는 해당 기간동안 보관될 수 있습니다.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="cg5 cg6 cg202 cg8 cg48 cg140 cg9 cg10 cg11" data-node-id="336:32093" data-name="Next action">
          <div className="cg459 cg5 cg6 cg13 cg56 cg35 cg40 cg17 cg48 cg150 cg219 cg9 cg29" data-node-id="450:17967" data-name="Button">
            <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg121 cg24" data-node-id="I450:17967;441:17143">
              계정 삭제하기
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
