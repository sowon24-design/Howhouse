// @ts-nocheck
// Figma 336:31089: D02-1 프로필 설정. Exact supplied artwork and copy; interactive adaptation is in Scene.tsx.
import imgSize24 from '../assets/014db1ea-7103-4cd4-8e33-cad2f7f1c313.svg'
import imgImage262 from '../assets/27871bc8-3b7b-4c6a-a0f5-b028e717f6b2.png'
import imgStatusBar from '../assets/180fe36a-72a7-4086-b076-ea3a9b839e7b.svg'

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

export default function D021() {
  return (
    <div className="cg47 cg5 cg6 cg14 cg8 cg48 cg9 cg50 cg4" data-node-id="336:31089" data-name="D02-1 프로필 설정">
      <div className="cg5 cg6 cg14 cg51 cg52 cg35 cg53 cg9 cg10 cg11" data-node-id="336:31090" data-name="상단바">
        <div className="cg54 cg9 cg10 cg55" data-node-id="336:31092" data-name="status bar">
          <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgStatusBar} />
        </div>
      </div>
      <div className="cg47 cg5 cg6 cg56 cg35 cg57 cg48 cg177 cg9 cg10 cg11" data-node-id="414:4924" data-name="GNB">
        <IconArrowLeft className="cg9 cg10 cg117" />
        <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg59 cg22 cg24" data-node-id="I414:4924;411:4466">
          프로필 설정하기
        </p>
        <div className="cg9 cg10 cg117" data-node-id="I414:4924;411:4479" data-name="Icon/Blank" />
      </div>
      <div className="cg5 cg6 cg13 cg14 cg35 cg57 cg306 cg48 cg157 cg481 cg58 cg9 cg11" data-node-id="336:31123" data-name="Message / Content">
        <div className="cg5 cg6 cg14 cg64 cg35 cg40 cg9 cg10 cg11" data-node-id="336:31124">
          <div className="cg190 cg387 cg132 cg134 cg48 cg9 cg508 cg10 cg509" data-node-id="1047:19183">
            <div className="cg137 cg284 cg0 cg510 cg511 cg453 cg512" data-node-id="1047:19184" data-name="image 262">
              <img alt="" className="cg0 cg2 cg3 cg33 cg31 cg4" src={imgImage262} />
            </div>
          </div>
          <div className="cg5 cg6 cg14 cg34 cg8 cg48 cg9 cg10 cg11" data-node-id="336:31127" data-name="Related community">
            <div className="cg5 cg6 cg35 cg57 cg9 cg10 cg11" data-node-id="336:31128">
              <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:31129">
                닉네임
              </p>
            </div>
            <div className="cg12 cg125 cg5 cg6 cg14 cg34 cg131 cg18 cg48 cg257 cg258 cg9 cg200 cg10 cg11" data-node-id="336:31130" data-name="자취 팁">
              <p className="cg25 cg16 cg186 cg9 cg10 cg21 cg162 cg187" data-node-id="336:31131">
                김서윤
              </p>
              <p className="cg37 cg38 cg9 cg10 cg464 cg26 cg24" data-node-id="336:31132">
                3/10
              </p>
            </div>
          </div>
          <div className="cg5 cg6 cg14 cg34 cg8 cg48 cg9 cg10 cg11" data-node-id="336:31133" data-name="Related community">
            <div className="cg5 cg6 cg35 cg57 cg9 cg10 cg11" data-node-id="336:31134">
              <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:31135">
                자취 기간
              </p>
            </div>
            <div className="cg125 cg5 cg6 cg14 cg513 cg131 cg48 cg257 cg258 cg9 cg200 cg10 cg11" data-node-id="336:31136" data-name="자취 팁">
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg162 cg11" data-node-id="336:31137">
                1년 2개월
              </p>
            </div>
          </div>
        </div>
        <div className="cg5 cg6 cg202 cg8 cg48 cg140 cg9 cg10 cg11" data-node-id="336:31138" data-name="Next action">
          <div className="cg220 cg5 cg6 cg13 cg56 cg35 cg40 cg17 cg48 cg150 cg219 cg9 cg29" data-node-id="450:17945" data-name="Button">
            <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg121 cg24" data-node-id="I450:17945;441:17129">
              수정하기
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
