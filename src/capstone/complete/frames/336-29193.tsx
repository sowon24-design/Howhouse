// @ts-nocheck
// Figma 336:29193: B02-5 검색결과 없음. Exact supplied artwork and copy; interactive adaptation is in Scene.tsx.
import imgSize24 from '../assets/014db1ea-7103-4cd4-8e33-cad2f7f1c313.svg'
import imgFrame2087330612 from '../assets/221712d5-d733-4228-810d-3e649f4cadae.png'
import imgStatusBar from '../assets/180fe36a-72a7-4086-b076-ea3a9b839e7b.svg'
import imgIconXMark from '../assets/025414c5-47c5-478c-877f-0535d4972c42.svg'
import imgIconXMark1 from '../assets/10d0235e-8811-4c54-85dd-b6d5368ff46b.svg'

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

export default function B025() {
  return (
    <div className="cg47 cg5 cg6 cg14 cg8 cg48 cg9 cg50 cg4" data-node-id="336:29193" data-name="B02-5 검색결과 없음">
      <div className="cg5 cg6 cg14 cg51 cg52 cg35 cg53 cg9 cg10 cg11" data-node-id="336:29194" data-name="상단바">
        <div className="cg54 cg9 cg10 cg55" data-node-id="336:29196" data-name="status bar">
          <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgStatusBar} />
        </div>
      </div>
      <div className="cg47 cg5 cg6 cg56 cg35 cg57 cg48 cg177 cg9 cg10 cg11" data-node-id="414:4750" data-name="GNB">
        <IconArrowLeft className="cg9 cg10 cg117" />
        <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg59 cg22 cg24" data-node-id="I414:4750;411:4466">
          검색 결과
        </p>
        <div className="cg9 cg10 cg117" data-node-id="I414:4750;411:4479" data-name="Icon/X-mark">
          <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconXMark} />
        </div>
      </div>
      <div className="cg5 cg6 cg13 cg14 cg253 cg8 cg259 cg48 cg49 cg63 cg255 cg9 cg11" data-node-id="336:29227" data-name="Community / Content">
        <div className="cg125 cg5 cg6 cg7 cg56 cg35 cg48 cg112 cg9 cg160 cg10 cg11" data-node-id="431:14546" data-name="Search">
          <p className="cg12 cg13 cg25 cg16 cg17 cg18 cg9 cg21 cg22" data-node-id="I431:14546;431:14499">
            배수구
          </p>
          <div className="cg9 cg10 cg36" data-node-id="I431:14546;431:14509" data-name="Icon/X-mark">
            <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconXMark1} />
          </div>
        </div>
        <div className="cg5 cg6 cg13 cg14 cg15 cg8 cg259 cg9 cg11" data-node-id="336:29232">
          <div className="cg12 cg19 cg66 cg18 cg9 cg10 cg59 cg162 cg163" data-node-id="336:29233">
            <p className="cg244">
              <span className="cg16">‘</span>
              <span className="cg16 cg60">배수구</span>
              <span className="cg16">’에 대한 검색결과를</span>
            </p>
            <p className="cg16">찾지 못했어요.</p>
          </div>
          <div className="cg5 cg6 cg13 cg14 cg35 cg40 cg259 cg9 cg11" data-node-id="336:29234">
            <div className="cg6 cg35 cg40 cg9 cg10" data-node-id="1047:19142">
              <div className="cg260 cg42 cg261">
                <div className="cg73 cg9 cg262">
                  <img alt="" className="cg0 cg2 cg3 cg263 cg31 cg4" src={imgFrame2087330612} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
