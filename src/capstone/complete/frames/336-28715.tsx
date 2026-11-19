// @ts-nocheck
// Figma 336:28715: C05-1 검색. Exact supplied artwork and copy; interactive adaptation is in Scene.tsx.
import imgSize24 from '../assets/77b8b0b6-a562-4592-8994-f833e91d7fe2.svg'
import imgSize25 from '../assets/014db1ea-7103-4cd4-8e33-cad2f7f1c313.svg'
import imgStatusBar from '../assets/180fe36a-72a7-4086-b076-ea3a9b839e7b.svg'
import imgIconXMark from '../assets/90b067a8-b105-4faf-9f88-7014a07760e5.svg'

type IconMagnifierProps = {
  className?: string;
  size?: "24";
};

function IconMagnifier({ className, size = "24" }: IconMagnifierProps) {
  return (
    <div className={className || "cg9 cg117"} data-node-id="408:3708">
      <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgSize24} />
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
      <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgSize25} />
    </div>
  );
}

export default function C051() {
  return (
    <div className="cg47 cg5 cg6 cg14 cg8 cg48 cg9 cg50 cg4" data-node-id="336:28715" data-name="C05-1 검색">
      <div className="cg47 cg5 cg6 cg14 cg51 cg52 cg35 cg53 cg9 cg10 cg11" data-node-id="336:28716" data-name="상단바">
        <div className="cg0 cg47 cg2" data-node-id="336:28717" />
        <div className="cg54 cg9 cg10 cg55" data-node-id="336:28718" data-name="status bar">
          <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgStatusBar} />
        </div>
      </div>
      <div className="cg47 cg5 cg6 cg56 cg35 cg57 cg48 cg58 cg9 cg10 cg11" data-node-id="414:4871" data-name="GNB">
        <IconArrowLeft className="cg9 cg10 cg117" />
        <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg59 cg22 cg24" data-node-id="I414:4871;411:4466">
          글 검색하기
        </p>
        <div className="cg9 cg10 cg117" data-node-id="I414:4871;411:4479" data-name="Icon/Blank" />
      </div>
      <div className="cg5 cg6 cg14 cg253 cg8 cg48 cg254 cg63 cg255 cg9 cg10 cg11" data-node-id="336:28749" data-name="Community / Content">
        <div className="cg125 cg5 cg6 cg56 cg35 cg57 cg48 cg112 cg9 cg160 cg10 cg11" data-node-id="431:14555" data-name="Search">
          <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg161 cg21 cg24" data-node-id="I431:14555;431:14494">
            찾는 글이 있나요?
          </p>
          <IconMagnifier className="cg9 cg10 cg117" />
        </div>
        <div className="cg5 cg6 cg14 cg7 cg8 cg9 cg10 cg11" data-node-id="336:28754" data-name="Related community">
          <div className="cg5 cg6 cg14 cg8 cg9 cg10 cg11" data-node-id="336:28755">
            <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg162 cg24" data-node-id="336:28756">
              최근 검색어
            </p>
          </div>
          <div className="cg204 cg6 cg205 cg34 cg8 cg9 cg10 cg11" data-node-id="458:4585">
            <div className="cg218 cg5 cg6 cg34 cg35 cg256 cg48 cg257 cg258 cg9 cg129 cg10" data-node-id="458:4586" data-name="태그">
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg69 cg24" data-node-id="I458:4586;450:17924">
                누수
              </p>
              <div className="cg9 cg10 cg36" data-node-id="I458:4586;450:17925" data-name="Icon/X-mark">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconXMark} />
              </div>
            </div>
            <div className="cg218 cg5 cg6 cg34 cg35 cg256 cg48 cg257 cg258 cg9 cg129 cg10" data-node-id="458:4587" data-name="태그">
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg69 cg24" data-node-id="I458:4587;450:17924">
                곰팡이
              </p>
              <div className="cg9 cg10 cg36" data-node-id="I458:4587;450:17925" data-name="Icon/X-mark">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconXMark} />
              </div>
            </div>
            <div className="cg218 cg5 cg6 cg34 cg35 cg256 cg48 cg257 cg258 cg9 cg129 cg10" data-node-id="458:4588" data-name="태그">
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg69 cg24" data-node-id="I458:4588;450:17924">
                곰팡이
              </p>
              <div className="cg9 cg10 cg36" data-node-id="I458:4588;450:17925" data-name="Icon/X-mark">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconXMark} />
              </div>
            </div>
            <div className="cg218 cg5 cg6 cg34 cg35 cg256 cg48 cg257 cg258 cg9 cg129 cg10" data-node-id="458:4589" data-name="태그">
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg69 cg24" data-node-id="I458:4589;450:17924">
                곰팡이
              </p>
              <div className="cg9 cg10 cg36" data-node-id="I458:4589;450:17925" data-name="Icon/X-mark">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconXMark} />
              </div>
            </div>
            <div className="cg218 cg5 cg6 cg34 cg35 cg256 cg48 cg257 cg258 cg9 cg129 cg10" data-node-id="458:4590" data-name="태그">
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg69 cg24" data-node-id="I458:4590;450:17924">
                곰팡이
              </p>
              <div className="cg9 cg10 cg36" data-node-id="I458:4590;450:17925" data-name="Icon/X-mark">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconXMark} />
              </div>
            </div>
            <div className="cg218 cg5 cg6 cg34 cg35 cg256 cg48 cg257 cg258 cg9 cg129 cg10" data-node-id="458:4591" data-name="태그">
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg69 cg24" data-node-id="I458:4591;450:17924">
                보일러 누수
              </p>
              <div className="cg9 cg10 cg36" data-node-id="I458:4591;450:17925" data-name="Icon/X-mark">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconXMark} />
              </div>
            </div>
            <div className="cg218 cg5 cg6 cg34 cg35 cg256 cg48 cg257 cg258 cg9 cg129 cg10" data-node-id="458:4592" data-name="태그">
              <p className="cg12 cg25 cg16 cg18 cg9 cg10 cg21 cg69 cg24" data-node-id="I458:4592;450:17924">
                곰팡이
              </p>
              <div className="cg9 cg10 cg36" data-node-id="I458:4592;450:17925" data-name="Icon/X-mark">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconXMark} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
