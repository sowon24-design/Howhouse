// @ts-nocheck
// Figma 336:30472: C02-1 글쓰기. Exact supplied artwork and copy; interactive adaptation is in Scene.tsx.
import imgGroup from '../assets/10598a24-b65a-4d05-97ef-b2345736f8aa.svg'
import imgIconArrowBottom from '../assets/512316ca-67d5-449a-ae73-596517ee55b1.svg'
import imgSize28 from '../assets/03d977da-30c8-4d1f-9fca-bc34a5f37780.svg'
import imgSize24 from '../assets/014db1ea-7103-4cd4-8e33-cad2f7f1c313.svg'
import imgStatusBar from '../assets/180fe36a-72a7-4086-b076-ea3a9b839e7b.svg'

type ComponentProps = {
  className?: string;
  property1?: "Close";
};

function Component({ className, property1 = "Close" }: ComponentProps) {
  return (
    <div className={className || "cg5 cg6 cg14 cg7 cg8 cg9"} data-node-id="336:27406">
      <div className="cg132 cg133 cg134 cg5 cg6 cg149 cg35 cg57 cg256 cg48 cg9 cg10 cg163" data-node-id="336:27407" data-name="자취 팁">
        <div className="cg5 cg6 cg13 cg15 cg35 cg17 cg9" data-node-id="336:27408">
          <div className="cg48 cg9 cg10 cg36" data-node-id="436:14758" data-name="Icon/Warning">
            <div className="cg0 cg214" data-node-id="I436:14758;408:3804" data-name="Group">
              <div className="cg0 cg215">
                <img alt="" className="cg1 cg3 cg4" src={imgGroup} />
              </div>
            </div>
          </div>
          <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg22 cg24" data-node-id="336:27413">
            게시글 작성 전 확인해 주세요.
          </p>
        </div>
        <div className="cg9 cg10 cg130" data-node-id="436:14921" data-name="Icon/Arrow_Bottom">
          <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconArrowBottom} />
        </div>
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

export default function C021() {
  return (
    <div className="cg47 cg5 cg6 cg14 cg8 cg48 cg9 cg50 cg4" data-node-id="336:30472" data-name="C02-1 글쓰기">
      <div className="cg47 cg5 cg6 cg14 cg51 cg52 cg35 cg53 cg9 cg10 cg11" data-node-id="336:30473" data-name="상단바">
        <div className="cg0 cg47 cg2" data-node-id="336:30474" />
        <div className="cg54 cg9 cg10 cg55" data-node-id="336:30475" data-name="status bar">
          <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgStatusBar} />
        </div>
      </div>
      <div className="cg47 cg5 cg6 cg56 cg35 cg57 cg48 cg58 cg9 cg10 cg11" data-node-id="414:4781" data-name="GNB">
        <IconArrowLeft className="cg9 cg10 cg117" />
        <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg59 cg22 cg24" data-node-id="I414:4781;411:4466">
          글 작성하기
        </p>
        <div className="cg9 cg10 cg117" data-node-id="I414:4781;411:4479" data-name="Icon/Blank" />
      </div>
      <div className="cg5 cg6 cg14 cg180 cg8 cg48 cg254 cg63 cg255 cg9 cg10 cg11" data-node-id="336:30506" data-name="Community / Content">
        <div className="cg5 cg6 cg14 cg243 cg8 cg9 cg10 cg11" data-node-id="336:30507">
          <div className="cg5 cg6 cg14 cg243 cg8 cg9 cg10 cg11" data-node-id="336:30508">
            <div className="cg5 cg6 cg14 cg34 cg8 cg9 cg10 cg11" data-node-id="336:30509" data-name="Related community">
              <div className="cg5 cg6 cg35 cg57 cg9 cg10 cg11" data-node-id="336:30510">
                <p className="cg12 cg19 cg66 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30511">
                  <span className="cg16">{`글 유형 `}</span>
                  <span className="cg16 cg461">*</span>
                </p>
              </div>
              <div className="cg462 cg6 cg205 cg409 cg35 cg9 cg10 cg11" data-node-id="336:30512" data-name="Categories">
                <div className="cg190 cg5 cg6 cg8 cg48 cg257 cg258 cg9 cg113 cg393 cg10" data-node-id="458:4868" data-name="Chip">
                  <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="I458:4868;450:17929">
                    도움 요청
                  </p>
                </div>
                <div className="cg190 cg5 cg6 cg8 cg48 cg257 cg258 cg9 cg113 cg393 cg10" data-node-id="458:4871" data-name="Chip">
                  <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="I458:4871;450:17929">
                    자취 팁
                  </p>
                </div>
                <div className="cg190 cg5 cg6 cg8 cg48 cg257 cg258 cg9 cg113 cg393 cg10" data-node-id="458:4874" data-name="Chip">
                  <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="I458:4874;450:17929">
                    수리 책임
                  </p>
                </div>
                <div className="cg190 cg5 cg6 cg8 cg48 cg257 cg258 cg9 cg113 cg393 cg10" data-node-id="458:4877" data-name="Chip">
                  <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="I458:4877;450:17929">
                    해결 후기
                  </p>
                </div>
                <div className="cg190 cg5 cg165 cg6 cg8 cg257 cg258 cg9 cg113 cg10" data-node-id="458:4884" data-name="Chip">
                  <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg245 cg26 cg24" data-node-id="I458:4884;450:17929">
                    기타
                  </p>
                </div>
              </div>
            </div>
            <div className="cg5 cg6 cg14 cg34 cg8 cg48 cg9 cg10 cg11" data-node-id="336:30523" data-name="Related community">
              <div className="cg5 cg6 cg35 cg57 cg9 cg10 cg11" data-node-id="336:30524">
                <p className="cg12 cg19 cg66 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30525">
                  <span className="cg16">{`제목 `}</span>
                  <span className="cg16 cg461">*</span>
                </p>
              </div>
              <div className="cg12 cg125 cg5 cg6 cg14 cg34 cg131 cg18 cg48 cg257 cg258 cg9 cg310 cg10 cg11" data-node-id="336:30526" data-name="자취 팁">
                <p className="cg25 cg16 cg463 cg186 cg9 cg10 cg245 cg21 cg187" data-node-id="336:30527">
                  제목을 입력해 주세요.
                </p>
                <p className="cg37 cg38 cg9 cg10 cg464 cg26 cg24" data-node-id="336:30528">
                  0/60
                </p>
              </div>
            </div>
            <div className="cg5 cg6 cg14 cg34 cg8 cg48 cg9 cg10 cg11" data-node-id="336:30529" data-name="Related community">
              <div className="cg5 cg6 cg35 cg57 cg9 cg10 cg11" data-node-id="336:30530">
                <p className="cg12 cg19 cg66 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30531">
                  <span className="cg16">{`내용 `}</span>
                  <span className="cg16 cg461">*</span>
                </p>
              </div>
              <div className="cg12 cg125 cg5 cg6 cg14 cg34 cg131 cg18 cg48 cg257 cg258 cg9 cg310 cg10 cg11" data-node-id="336:30532" data-name="자취 팁">
                <p className="cg25 cg16 cg465 cg186 cg9 cg10 cg245 cg21 cg187" data-node-id="336:30533">
                  제목을 입력해 주세요.
                </p>
                <p className="cg37 cg38 cg9 cg10 cg464 cg26 cg24" data-node-id="336:30534">
                  0/1000
                </p>
              </div>
            </div>
            <div className="cg5 cg6 cg14 cg34 cg8 cg48 cg9 cg10 cg11" data-node-id="336:30535" data-name="Related community">
              <div className="cg5 cg6 cg35 cg57 cg9 cg10 cg11" data-node-id="336:30536">
                <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30537">
                  사진 첨부하기 (0/5)
                </p>
              </div>
              <div className="cg5 cg6 cg8 cg9 cg10 cg11" data-node-id="336:30538">
                <div className="cg125 cg5 cg6 cg14 cg35 cg40 cg48 cg313 cg258 cg9 cg29 cg10 cg314" data-node-id="462:9076" data-name="Add image">
                  <IconPlus className="cg9 cg10 cg122" />
                </div>
              </div>
            </div>
            <div className="cg5 cg6 cg14 cg34 cg8 cg48 cg9 cg10 cg11" data-node-id="336:30542" data-name="Related community">
              <div className="cg5 cg6 cg35 cg57 cg9 cg10 cg11" data-node-id="336:30543">
                <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:30544">
                  태그 (0/5)
                </p>
              </div>
              <div className="cg125 cg5 cg6 cg14 cg149 cg8 cg40 cg256 cg48 cg257 cg258 cg9 cg310 cg10 cg11" data-node-id="336:30545" data-name="자취 팁">
                <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg245 cg21 cg11" data-node-id="336:30546">
                  태그를 입력해 주세요. (예: 누수, 곰팡이)
                </p>
              </div>
            </div>
          </div>
          <Component className="cg5 cg6 cg14 cg7 cg8 cg9 cg10 cg11" />
        </div>
        <div className="cg5 cg6 cg202 cg8 cg48 cg140 cg9 cg10 cg11" data-node-id="336:30548" data-name="Next action">
          <div className="cg459 cg5 cg6 cg13 cg56 cg35 cg40 cg17 cg48 cg150 cg219 cg9 cg29" data-node-id="450:17803" data-name="Button">
            <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg121 cg24" data-node-id="I450:17803;441:17143">
              글 올리기
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
