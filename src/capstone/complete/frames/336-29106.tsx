// @ts-nocheck
// Figma 336:29106: B02-4 검색결과. Exact supplied artwork and copy; interactive adaptation is in Scene.tsx.
import imgSize24 from '../assets/014db1ea-7103-4cd4-8e33-cad2f7f1c313.svg'
import imgStatusBar from '../assets/180fe36a-72a7-4086-b076-ea3a9b839e7b.svg'
import imgIconXMark from '../assets/025414c5-47c5-478c-877f-0535d4972c42.svg'
import imgIconXMark1 from '../assets/10d0235e-8811-4c54-85dd-b6d5368ff46b.svg'
import imgIconArrowLeft from '../assets/220d92e3-16c4-4358-b63b-c0e9f8c15ce6.svg'

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

export default function B024() {
  return (
    <div className="cg47 cg5 cg6 cg14 cg8 cg48 cg9 cg50 cg4" data-node-id="336:29106" data-name="B02-4 검색결과">
      <div className="cg5 cg6 cg14 cg51 cg52 cg35 cg53 cg9 cg10 cg11" data-node-id="336:29107" data-name="상단바">
        <div className="cg54 cg9 cg10 cg55" data-node-id="336:29109" data-name="status bar">
          <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgStatusBar} />
        </div>
      </div>
      <div className="cg47 cg5 cg6 cg56 cg35 cg57 cg48 cg177 cg9 cg10 cg11" data-node-id="414:4743" data-name="GNB">
        <IconArrowLeft className="cg9 cg10 cg117" />
        <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg59 cg22 cg24" data-node-id="I414:4743;411:4466">
          검색 결과
        </p>
        <div className="cg9 cg10 cg117" data-node-id="I414:4743;411:4479" data-name="Icon/X-mark">
          <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconXMark} />
        </div>
      </div>
      <div className="cg5 cg6 cg14 cg253 cg8 cg48 cg254 cg63 cg255 cg9 cg10 cg11" data-node-id="336:29140" data-name="Community / Content">
        <div className="cg125 cg5 cg6 cg7 cg56 cg35 cg48 cg112 cg9 cg160 cg10 cg11" data-node-id="431:14538" data-name="Search">
          <p className="cg12 cg13 cg25 cg16 cg17 cg18 cg9 cg21 cg22" data-node-id="I431:14538;431:14499">
            배수구
          </p>
          <div className="cg9 cg10 cg36" data-node-id="I431:14538;431:14509" data-name="Icon/X-mark">
            <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconXMark1} />
          </div>
        </div>
        <div className="cg5 cg6 cg14 cg243 cg8 cg9 cg10 cg11" data-node-id="336:29145">
          <div className="cg12 cg19 cg66 cg18 cg9 cg10 cg59 cg162 cg163" data-node-id="336:29146">
            <p className="cg244">
              <span className="cg16">‘</span>
              <span className="cg16 cg60">배수구</span>
              <span className="cg16">’에 대한 검색 결과가</span>
            </p>
            <p className="cg16">총 2건 있어요.</p>
          </div>
          <div className="cg5 cg6 cg14 cg7 cg8 cg48 cg9 cg10 cg11" data-node-id="336:29147" data-name="Case list">
            <div className="cg125 cg5 cg6 cg7 cg35 cg48 cg126 cg127 cg128 cg9 cg129 cg10 cg11" data-node-id="369:10414" data-name="List">
              <div className="cg5 cg6 cg13 cg14 cg8 cg17 cg48 cg9" data-node-id="I369:10414;355:7566" data-name="Label">
                <p className="cg12 cg37 cg16 cg18 cg9 cg10 cg21 cg22 cg11" data-node-id="I369:10414;355:7567">
                  욕실 배수구에서 냄새가 나요
                </p>
              </div>
              <div className="cg9 cg10 cg130" data-node-id="I369:10414;419:5712" data-name="Icon/Arrow_Left">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconArrowLeft} />
              </div>
            </div>
            <div className="cg125 cg5 cg6 cg7 cg35 cg48 cg126 cg127 cg128 cg9 cg129 cg10 cg11" data-node-id="369:10421" data-name="List">
              <div className="cg5 cg6 cg13 cg14 cg8 cg17 cg48 cg9" data-node-id="I369:10421;355:7566" data-name="Label">
                <p className="cg12 cg37 cg16 cg18 cg9 cg10 cg21 cg22 cg11" data-node-id="I369:10421;355:7567">
                  배수구에 물이 고여서 내려가지 않아요
                </p>
              </div>
              <div className="cg9 cg10 cg130" data-node-id="I369:10421;419:5712" data-name="Icon/Arrow_Left">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconArrowLeft} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
