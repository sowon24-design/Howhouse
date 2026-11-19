// @ts-nocheck
// Figma 336:27446: A01 홈. Exact supplied artwork and copy; interactive adaptation is in Scene.tsx.
import imgSize28StyleFill from '../assets/03c75980-d870-4c43-a989-934c8aabc326.svg'
import imgSize24StyleFill from '../assets/4764e9f6-13fe-4886-b6ff-bbf6a3e91d2e.svg'
import imgSize28StyleFill1 from '../assets/1f326d16-1146-49e9-8566-671b3a5b23a5.svg'
import imgImage from '../assets/0a97a155-85fa-4147-ae26-db599c6bdda0.png'
import imgIconHeart from '../assets/5240e9a0-fb65-4f7c-ac64-14ccb51237f7.svg'
import imgIconCommunity from '../assets/7650f601-9c04-4bbb-9e06-7562e60fd839.svg'
import imgLine4 from '../assets/38b6ff73-bde0-4039-b377-a1b46970984d.svg'
import { motion } from "motion/react";
import img from '../assets/d2f7bc7f-1981-40c4-a520-d2df372bc334.png'
import img1 from '../assets/875bab49-bc39-475a-93e7-793eee0d4f9d.png'
import img3 from '../assets/d61dc363-7bda-4ba8-a774-45fc0acf13b8.png'
import img5 from '../assets/96156abc-b753-4a07-a9db-b1fcdb521ad7.png'
import img6 from '../assets/a6cabd11-215f-4ea3-859e-5a2c76013ef6.png'
import imgStatusBar from '../assets/180fe36a-72a7-4086-b076-ea3a9b839e7b.svg'
import img2 from '../assets/8e9e4823-9b75-4c2b-b0e9-884575da9563.svg'
import img4 from '../assets/3d28be23-7a09-4f20-990c-6f28e395550e.svg'
import imgIconMagnifier from '../assets/b6013db9-1a4e-466d-ac1a-b4e4f1ee9a26.svg'
import imgIconArrowRight from '../assets/065d5ceb-d548-4cba-8af4-cb0f609cee9f.svg'
import imgIconArrowLeft from '../assets/9f47085e-fff6-4b28-8514-6dbf38be5c21.svg'
import imgIconHome from '../assets/df3469f4-e98b-41ea-a8f6-006c4b36e140.svg'

type IconProfileProps = {
  className?: string;
  size?: "28";
  style?: "Fill";
};

function IconProfile({ className, size = "28", style = "Fill" }: IconProfileProps) {
  return (
    <div className={className || "cg9 cg122"} data-node-id="355:7472">
      <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgSize28StyleFill} />
    </div>
  );
}

type IconCommunityProps = {
  className?: string;
  size?: "24";
  style?: "Fill";
};

function IconCommunity({ className, size = "24", style = "Fill" }: IconCommunityProps) {
  return (
    <div className={className || "cg9 cg117"} data-node-id="355:7403">
      <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgSize24StyleFill} />
    </div>
  );
}

type IconBookProps = {
  className?: string;
  size?: "28";
  style?: "Fill";
};

function IconBook({ className, size = "28", style = "Fill" }: IconBookProps) {
  return (
    <div className={className || "cg9 cg122"} data-node-id="411:4290">
      <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgSize28StyleFill1} />
    </div>
  );
}

type NavigationBarCommunityPostProps = {
  className?: string;
  boolean?: boolean;
};

function NavigationBarCommunityPost({ className, boolean = true }: NavigationBarCommunityPostProps) {
  return (
    <div className={className || "cg132 cg133 cg134 cg5 cg6 cg14 cg7 cg8 cg48 cg135 cg136 cg9 cg155"} data-node-id="355:8265" data-name="Navigation Bar/Community_Post">
      <div className="cg5 cg6 cg7 cg8 cg9 cg10 cg11" data-node-id="355:8259">
        <div className="cg12 cg5 cg6 cg13 cg14 cg15 cg8 cg16 cg17 cg18 cg9" data-node-id="355:8240">
          <p className="cg19 cg20 cg9 cg10 cg21 cg22 cg23 cg11 cg24" data-node-id="355:8241">
            자취생 꿀팁!
          </p>
          <p className="cg25 cg20 cg9 cg10 cg26 cg27 cg23 cg11" data-node-id="355:8242">
            생활용품은 조금씩! 꼭 필요한 것부터 하나씩 채워보세요. 한 번에 많이 사두는 것은 자취생한테 금물!! 어차피 쓰지도 못한답니다.
          </p>
        </div>
        {boolean && (
          <div className="cg28 cg9 cg29 cg30 cg10" data-node-id="355:8257" data-name="Image (햇빛이 드는 창가와 화분)">
            <div aria-hidden className="cg0 cg2 cg31 cg29">
              <div className="cg0 cg32 cg2 cg29" />
              <img alt="" className="cg0 cg3 cg33 cg29 cg4" src={imgImage} />
            </div>
          </div>
        )}
      </div>
      <div className="cg5 cg6 cg34 cg35 cg9 cg10" data-node-id="355:8542">
        <div className="cg5 cg6 cg15 cg35 cg9 cg10" data-node-id="355:8571">
          <div className="cg9 cg10 cg36" data-node-id="369:9051" data-name="Icon/Heart">
            <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconHeart} />
          </div>
          <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg27 cg24" data-node-id="355:8566">
            6
          </p>
        </div>
        <div className="cg5 cg6 cg15 cg35 cg9 cg10" data-node-id="355:8583">
          <div className="cg9 cg10 cg36" data-node-id="355:8620" data-name="Icon/Community">
            <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconCommunity} />
          </div>
          <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg27 cg24" data-node-id="355:8578">
            11
          </p>
        </div>
        <div className="cg6 cg39 cg35 cg40 cg9 cg10 cg41" data-node-id="355:8594">
          <div className="cg42 cg43">
            <div className="cg44 cg9 cg45">
              <div className="cg0 cg46">
                <img alt="" className="cg1 cg3 cg4" src={imgLine4} />
              </div>
            </div>
          </div>
        </div>
        <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg27 cg24" data-node-id="355:8588">
          2시간 전
        </p>
        <div className="cg6 cg39 cg35 cg40 cg9 cg10 cg41" data-node-id="355:8544">
          <div className="cg42 cg43">
            <div className="cg44 cg9 cg45">
              <div className="cg0 cg46">
                <img alt="" className="cg1 cg3 cg4" src={imgLine4} />
              </div>
            </div>
          </div>
        </div>
        <p className="cg12 cg37 cg38 cg18 cg9 cg10 cg26 cg27 cg24" data-node-id="355:8591">
          김서윤
        </p>
      </div>
    </div>
  );
}

export default function A01() {
  return (
    <div className="cg47 cg5 cg6 cg14 cg8 cg48 cg49 cg9 cg50 cg4" data-node-id="336:27446" data-name="A01 홈">
      <div className="cg5 cg6 cg14 cg51 cg52 cg35 cg53 cg9 cg10 cg11" data-node-id="336:27447" data-name="상단바">
        <div className="cg54 cg9 cg10 cg55" data-node-id="336:27449" data-name="status bar">
          <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgStatusBar} />
        </div>
      </div>
      <div className="cg47 cg5 cg6 cg56 cg35 cg57 cg48 cg58 cg9 cg10 cg11" data-node-id="414:4778" data-name="GNB">
        <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg59 cg60 cg24" data-node-id="I414:4778;411:4585">
          어쩌집
        </p>
      </div>
      <div className="cg5 cg6 cg14 cg61 cg8 cg48 cg62 cg63 cg58 cg9 cg10 cg11" data-node-id="336:27476" data-name="Home / Content">
        <div className="cg5 cg6 cg14 cg64 cg8 cg9 cg10 cg11" data-node-id="1042:9657">
          <div className="cg12 cg5 cg6 cg14 cg8 cg18 cg9 cg10 cg24" data-node-id="1042:9658">
            <p className="cg65 cg66 cg9 cg10 cg67 cg68" data-node-id="1042:9659">
              <span className="cg16 cg69">자취하는 소라게</span>
              <span className="cg16">{` `}</span>
              <span className="cg16 cg22">님!</span>
            </p>
            <p className="cg37 cg70 cg9 cg10 cg59 cg71" data-node-id="1042:9660">
              어떤 도움이 필요하세요?
            </p>
          </div>
          <div className="cg5 cg6 cg14 cg35 cg40 cg9 cg10 cg11" data-node-id="1042:9661" data-name="Help banner">
            <div className="cg5 cg6 cg14 cg72 cg8 cg9 cg10 cg11" data-node-id="1042:9662">
              <div className="cg5 cg6 cg14 cg35 cg40 cg9 cg10 cg11" data-node-id="1042:9663">
                <div className="cg73 cg9 cg10 cg74" data-node-id="1042:9664" data-name="소라게 · 수정본 v2 · 걷기 2초">
                  <motion.div className="cg0 cg75 cg76 cg77 cg78" data-node-id="1042:9675" data-name="다리 2 · 직육면체"  style={{ transformOrigin: '50% 50%' }} transformTemplate={(_, generated) => `var(--motion-layout-transform, translate(0px)) ${generated === 'none' ? '' : generated}`} initial={{ y: 0, }} animate={{ y: [0, 0.621, 0, -0.621, 0, 0.621, 0, -0.621, 0], }} transition={{ duration: 2, times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1], ease: "linear", repeat: Infinity, }}>
                    <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={img2} />
                  </motion.div>
                  <motion.div className="cg0 cg79 cg80 cg81 cg82" data-node-id="1042:9688" data-name="다리 4 · 직육면체"  style={{ transformOrigin: '50% 50%' }} transformTemplate={(_, generated) => `var(--motion-layout-transform, translate(0px)) ${generated === 'none' ? '' : generated}`} initial={{ y: 0, }} animate={{ y: [0, 0.621, 0, -0.621, 0, 0.621, 0, -0.621, 0], }} transition={{ duration: 2, times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1], ease: "linear", repeat: Infinity, }}>
                    <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={img4} />
                  </motion.div>
                  <motion.div className="cg0 cg83 cg84 cg85 cg86" data-node-id="1042:9707" data-name="집"  style={{ transformOrigin: '50% 50%' }} transformTemplate={(_, generated) => `var(--motion-layout-transform, translate(0px)) ${generated === 'none' ? '' : generated}`} initial={{ rotate: -0.6, y: 0, }} animate={{ rotate: [-0.6, 0.6, -0.6, 0.6, -0.6], y: [0, -0.828, 0, -0.828, 0, -0.828, 0, -0.828, 0], }} transition={{ rotate: { duration: 2, times: [0, 0.25, 0.5, 0.75, 1], ease: "linear", repeat: Infinity }, y: { duration: 2, times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1], ease: "linear", repeat: Infinity }, }}>
                    <div className="cg0 cg2 cg20 cg31">
                      <img alt="" className="cg0 cg87 cg3 cg4 cg88" src={img} />
                    </div>
                  </motion.div>
                  <div className="cg0 cg6 cg89 cg35 cg40 cg90 cg91 cg92" data-node-id="1042:9718">
                    <div className="cg42 cg93">
                      <motion.div className="cg94 cg9 cg95" data-motion-for="1042:9718" data-name="몸"  style={{ transformOrigin: '0 0', transform: 'var(--motion-layout-transform, translate(0px)) var(--motion-design-transform-inverse, matrix(0.999885, -0.015146, 0.015146, 0.999885, 0, 0)) translate(0px, calc(var(--motion-translate-y, 0) * 1px)) var(--motion-design-transform, matrix(0.999885, 0.015146, -0.015146, 0.999885, 0, 0))' }} initial={{ '--motion-translate-y': 0, }} animate={{ '--motion-translate-y': [0, -0.828402, 0, -0.828402, 0, -0.828402, 0, -0.828402, 0], }} transition={{ '--motion-translate-y': { duration: 2, times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1], ease: "linear", repeat: Infinity }, }}>
                        <div className="cg0 cg2 cg20 cg31">
                          <img alt="" className="cg0 cg87 cg3 cg4 cg88" src={img1} />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                  <motion.div className="cg0 cg96 cg97 cg98" data-node-id="1042:9737" data-name="돋보기와 집게 · 공통 관절"  style={{ transformOrigin: '50% 50%' }} transformTemplate={(_, generated) => `var(--motion-layout-transform, translate(0px)) ${generated === 'none' ? '' : generated}`} initial={{ rotate: 2, x: -0.414, y: -1.243, }} animate={{ rotate: [2, -2, 2, -2, 2], x: [-0.414, 0, -0.414, 0, -0.414], y: [-1.243, 0, -1.243, 0, -1.243], }} transition={{ duration: 2, times: [0, 0.25, 0.5, 0.75, 1], ease: "linear", repeat: Infinity, }}>
                    <div className="cg0 cg99 cg100 cg101 cg102" data-node-id="1042:9738" data-name="집게 · 돋보기 쪽">
                      <div className="cg0 cg2 cg20 cg31">
                        <img alt="" className="cg0 cg87 cg3 cg4 cg88" src={img3} />
                      </div>
                    </div>
                    <div className="cg0 cg103 cg104 cg105 cg106" data-node-id="1042:9739" data-name="돋보기 · 손잡이 연결">
                      <div className="cg0 cg2 cg20 cg31">
                        <img alt="" className="cg0 cg87 cg3 cg4 cg88" src={img5} />
                      </div>
                    </div>
                  </motion.div>
                  <motion.div className="cg0 cg107 cg108 cg109 cg110" data-node-id="1042:9752" data-name="집게 · 앞"  style={{ transformOrigin: '50% 50%' }} transformTemplate={(_, generated) => `var(--motion-layout-transform, translate(0px)) ${generated === 'none' ? '' : generated}`} initial={{ rotate: -2, y: 0, }} animate={{ rotate: [-2, 2, -2, 2, -2], y: [0, -1.243, 0, -1.243, 0], }} transition={{ duration: 2, times: [0, 0.25, 0.5, 0.75, 1], ease: "linear", repeat: Infinity, }}>
                    <div className="cg0 cg2 cg20 cg31">
                      <img alt="" className="cg0 cg87 cg3 cg4 cg88" src={img6} />
                    </div>
                  </motion.div>
                </div>
              </div>
              <div className="cg5 cg6 cg35 cg57 cg9 cg10 cg11" data-node-id="1042:9753">
                <div className="cg5 cg6 cg13 cg14 cg111 cg8 cg17 cg9" data-node-id="1042:9754" data-name="Related community">
                  <div className="cg5 cg6 cg14 cg111 cg8 cg9 cg10 cg11" data-node-id="1042:9755" data-name="Related community">
                    <div className="cg5 cg6 cg35 cg57 cg48 cg112 cg9 cg113 cg10 cg11" data-node-id="1042:9756" data-name="Help banner">
                      <div aria-hidden className="cg0 cg2 cg31 cg113" style={{ backgroundImage: "linear-gradient(126.67114179597897deg, rgba(16, 138, 238, 0) 50%, rgb(16, 138, 238) 97.623%), linear-gradient(90deg, rgb(17, 87, 206) 0%, rgb(17, 87, 206) 100%)" }} />
                      <div className="cg5 cg6 cg7 cg35 cg9 cg10" data-node-id="1042:9757">
                        <div className="cg114 cg5 cg6 cg111 cg35 cg40 cg48 cg112 cg9 cg115 cg10 cg116" data-node-id="1042:9758" data-name="해결 방법">
                          <div className="cg9 cg10 cg117" data-node-id="1042:9759" data-name="Icon/Magnifier">
                            <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconMagnifier} />
                          </div>
                        </div>
                        <div className="cg12 cg5 cg6 cg14 cg118 cg8 cg18 cg48 cg9 cg10 cg119 cg24" data-node-id="1042:9760" data-name="Help copy">
                          <p className="cg37 cg38 cg9 cg10 cg26 cg120" data-node-id="1042:9761">
                            우리집 문제에 대한
                          </p>
                          <p className="cg19 cg16 cg9 cg10 cg21 cg121" data-node-id="1042:9762">
                            해결 방법을 찾아볼까요?
                          </p>
                        </div>
                      </div>
                      <div className="cg9 cg10 cg122" data-node-id="1042:9763" data-name="Icon/Arrow_Right">
                        <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconArrowRight} />
                      </div>
                      <div className="cg0 cg2 cg31 cg123 cg124" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="cg5 cg6 cg14 cg34 cg8 cg9 cg10 cg11" data-node-id="1042:9801">
          <p className="cg12 cg19 cg66 cg18 cg9 cg10 cg59 cg22 cg24" data-node-id="1042:9802">
            <span className="cg16 cg69">11월</span>
            <span className="cg16">에 많이 찾는 문제예요</span>
          </p>
          <div className="cg5 cg6 cg14 cg7 cg8 cg9 cg10 cg11" data-node-id="1042:9803" data-name="Case list">
            <div className="cg125 cg5 cg6 cg7 cg35 cg48 cg126 cg127 cg128 cg9 cg129 cg10 cg11" data-node-id="1042:9804" data-name="List">
              <div className="cg5 cg6 cg13 cg14 cg8 cg17 cg48 cg9" data-node-id="I1042:9804;355:7566" data-name="Label">
                <p className="cg12 cg37 cg16 cg18 cg9 cg10 cg21 cg22 cg11" data-node-id="I1042:9804;355:7567">
                  욕실 배수구에서 냄새가 나요
                </p>
              </div>
              <div className="cg9 cg10 cg130" data-node-id="I1042:9804;419:5712" data-name="Icon/Arrow_Left">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconArrowLeft} />
              </div>
            </div>
            <div className="cg125 cg5 cg6 cg7 cg35 cg48 cg126 cg127 cg128 cg9 cg129 cg10 cg11" data-node-id="1042:9805" data-name="List">
              <div className="cg5 cg6 cg13 cg14 cg8 cg17 cg48 cg9" data-node-id="I1042:9805;355:7566" data-name="Label">
                <p className="cg12 cg37 cg16 cg18 cg9 cg10 cg21 cg22 cg11" data-node-id="I1042:9805;355:7567">
                  배수구에 물이 고여서 내려가지 않아요
                </p>
              </div>
              <div className="cg9 cg10 cg130" data-node-id="I1042:9805;419:5712" data-name="Icon/Arrow_Left">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconArrowLeft} />
              </div>
            </div>
            <div className="cg125 cg5 cg6 cg7 cg35 cg48 cg126 cg127 cg128 cg9 cg129 cg10 cg11" data-node-id="1042:9806" data-name="List">
              <div className="cg5 cg6 cg13 cg14 cg8 cg17 cg48 cg9" data-node-id="I1042:9806;355:7566" data-name="Label">
                <p className="cg12 cg37 cg16 cg18 cg9 cg10 cg21 cg22 cg11" data-node-id="I1042:9806;355:7567">
                  방의 특정 부분이 따뜻해지지 않아요
                </p>
              </div>
              <div className="cg9 cg10 cg130" data-node-id="I1042:9806;419:5712" data-name="Icon/Arrow_Left">
                <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconArrowLeft} />
              </div>
            </div>
          </div>
        </div>
        <div className="cg5 cg6 cg14 cg34 cg8 cg9 cg10 cg11" data-node-id="336:27498">
          <div className="cg12 cg5 cg6 cg131 cg57 cg18 cg48 cg9 cg10 cg11 cg24" data-node-id="336:27499" data-name="지금 인기 있는 글">
            <p className="cg19 cg16 cg9 cg10 cg59 cg68" data-node-id="336:27500">
              다른 자취생들이 많이 본 이야기
            </p>
            <p className="cg37 cg38 cg9 cg10 cg26 cg60" data-node-id="336:27501">
              더 보기
            </p>
          </div>
          <div className="cg5 cg6 cg14 cg7 cg8 cg48 cg9 cg10 cg11" data-node-id="336:27502" data-name="Related / Solid list">
            <NavigationBarCommunityPost className="cg132 cg133 cg134 cg5 cg6 cg14 cg7 cg8 cg48 cg135 cg136 cg9 cg10 cg11" />
            <NavigationBarCommunityPost className="cg132 cg133 cg134 cg5 cg6 cg14 cg7 cg8 cg48 cg135 cg136 cg9 cg10 cg11" />
            <NavigationBarCommunityPost className="cg132 cg133 cg134 cg5 cg6 cg14 cg7 cg8 cg48 cg135 cg136 cg9 cg10 cg11" />
          </div>
        </div>
      </div>
      <div className="cg137 cg0 cg138 cg5 cg6 cg14 cg8 cg139 cg140 cg136 cg141 cg142" data-node-id="355:6400" data-name="Navigation Bar">
        <div className="cg5 cg6 cg111 cg143 cg35 cg48 cg144 cg9 cg129 cg145 cg10 cg11" data-node-id="I355:6400;355:6313" data-name="Navigation Bar">
          <div aria-hidden className="cg0 cg146 cg2 cg31 cg129" />
          <div className="cg147 cg5 cg6 cg13 cg148 cg149 cg35 cg57 cg17 cg48 cg150 cg151 cg9 cg115 cg152" data-node-id="I355:6400;355:6314" data-name="홈">
            <div className="cg9 cg10 cg122" data-node-id="I355:6400;355:7458" data-name="Icon/Home">
              <img alt="" className="cg0 cg1 cg2 cg3 cg4" src={imgIconHome} />
            </div>
            <div className="cg5 cg6 cg13 cg14 cg35 cg40 cg17 cg9" data-node-id="I355:6400;355:6317">
              <p className="cg12 cg19 cg16 cg18 cg9 cg10 cg21 cg69 cg153 cg11" data-node-id="I355:6400;355:6318">
                홈
              </p>
            </div>
          </div>
          <div className="cg5 cg6 cg111 cg149 cg35 cg40 cg48 cg150 cg151 cg9 cg115 cg10 cg116" data-node-id="I355:6400;355:6319" data-name="해결 방법">
            <IconBook className="cg9 cg10 cg122" />
          </div>
          <div className="cg5 cg6 cg111 cg149 cg35 cg40 cg48 cg150 cg151 cg9 cg115 cg10 cg116" data-node-id="I355:6400;355:6322" data-name="커뮤니티">
            <IconCommunity className="cg9 cg10 cg117" />
          </div>
          <div className="cg5 cg6 cg111 cg149 cg35 cg40 cg48 cg150 cg151 cg9 cg115 cg10 cg116" data-node-id="I355:6400;355:6325" data-name="마이">
            <IconProfile className="cg9 cg10 cg122" />
          </div>
          <div className="cg0 cg2 cg31 cg123 cg154" />
        </div>
      </div>
    </div>
  );
}
