import { Contributor, Topic } from '@/types';

export const UC_IRVINE = 'UC Irvine';
export const UC_SAN_DIEGO = 'UC San Diego';

export const ZHIQIN_LU: Contributor = {
  name: 'Zhiqin Lu',
  email: 'zlu@uci.edu',
  institute: UC_IRVINE,
};

export const CHRISTOPHER_DAVIS: Contributor = {
  name: 'Christopher Davis',
  email: 'daviscj@uci.edu',
  institute: UC_IRVINE,
};

export const XIANFU_LIU: Contributor = {
  name: 'Xianfu Liu',
  email: 'xianful@uci.edu',
  institute: UC_IRVINE,
};

export const YUE_CHU: Contributor = {
  name: 'Yue Chu',
  email: 'chuy13@uci.edu',
  institute: UC_IRVINE,
};

export const XINXI_GUO: Contributor = {
  name: 'Xinxi Guo',
  email: 'x6guo@ucsd.edu',
  institute: UC_SAN_DIEGO,
};

export const WENJING_LIN: Contributor = {
  name: 'Wenjing Lin',
  email: 'wenjinl8@uci.edu',
  institute: UC_IRVINE,
};

export const SHIYI_LYU: Contributor = {
  name: 'Shiyi Lyu',
  email: 'slyu6@uci.edu',
  institute: UC_IRVINE,
};

export const MAI_NGUYEN: Contributor = {
  name: 'Mai Nguyen',
  email: 'main5@uci.edu',
  institute: UC_IRVINE,
};

export const YUFEI_REN: Contributor = {
  name: 'Yufei Ren',
  email: 'yufeir@uci.edu',
  institute: UC_IRVINE,
};

export const JIMENA_ISABEL_RAZO: Contributor = {
  name: 'Jimena Isabel Razo',
  email: 'razoji@uci.edu',
  institute: UC_IRVINE,
};

export const SATYAKI_SARKAR: Contributor = {
  name: 'Satyaki Sarkar',
  email: 'satyakis@uci.edu',
  institute: UC_IRVINE,
};

export const STEPHANIE_WANG: Contributor = {
  name: 'Stephanie Wang',
  email: 'stephjw1@uci.edu',
  institute: UC_IRVINE,
};

export const NATASHA_XIAO: Contributor = {
  name: 'Natasha Xiao',
  email: 'jxiao12@uci.edu',
  institute: UC_IRVINE,
};

export const FELIX_YU: Contributor = {
  name: 'Felix Yu',
  email: 'felixyu2627@gmail.com',
};

export const MELISSA_YU: Contributor = {
  name: 'Melissa Yu',
  email: 'melissajiayu@gmail.com',
};

export const DAWEI_LIU: Contributor = {
  name: 'Dawei Liu',
  email: 'daweil7@uci.edu',
  institute: UC_IRVINE,
};

export const contributors: Array<Contributor> = [
  ZHIQIN_LU,
  CHRISTOPHER_DAVIS,
  XIANFU_LIU,
  YUE_CHU,
  XINXI_GUO,
  WENJING_LIN,
  SHIYI_LYU,
  MAI_NGUYEN,
  JIMENA_ISABEL_RAZO,
  SATYAKI_SARKAR,
  STEPHANIE_WANG,
  NATASHA_XIAO,
  FELIX_YU,
  MELISSA_YU,
];

export const otherEssays: Array<{ name: string, uri: string }> = [
  {
    name: 'The 20 degree questions',
    uri: 'pdfs/twenty-one.pdf',
  },
  {
    name: 'The usage of special techniques',
    uri: 'pdfs/special-techniques.pdf',
  },
];

export const otherLinks: Array<{ name: string, uri: string, author?: string }> = [
  {
    name: 'Geometry Unbound',
    uri: 'https://kskedlaya.org/geometryunbound/',
    author: 'Kiran Kedlaya',
  },
  {
    name: 'UCI Math Circle',
    uri: 'https://www.math.uci.edu/~mathcircle/',
  },
  {
    name: 'Fullerton Math Circle',
    uri: 'https://www.fullerton.edu/math/resources/mathcircle.php',
  },
  {
    name: 'Morning Star Institue',
    uri: 'http://www.morningstarinstitute.org/',
    author: 'Yifeng Yu',
  },
];

export const topics: Array<Topic> = [
  {
    name: "Morley's Miracle",
    index: 1,
    snapshot: 'images/snapshots/topic01.png',
    essay: 'pdfs/topic01.pdf',
    animationContributors: [
      MELISSA_YU,
    ],
    essayContributors: [
      ZHIQIN_LU,
    ],
  },
  {
    name: "Ceva's and Menelaus' Theorems",
    index: 2,
    snapshot: 'images/snapshots/topic02.png',
    essay: 'pdfs/topic02.pdf',
    animationContributors: [
      MAI_NGUYEN,
    ],
    essayContributors: [
      ZHIQIN_LU,
      XIANFU_LIU,
    ],
  },
  {
    name: 'Five Triangle Centers',
    index: 3,
    snapshot: 'images/snapshots/topic03.png',
    essay: 'pdfs/topic03.pdf',
    animationContributors: [
      XINXI_GUO,
    ],
    essayContributors: [
      ZHIQIN_LU,
      SHIYI_LYU,
    ],
  },
  {
    name: 'Erdős-Mordell Inequality',
    index: 4,
    snapshot: 'images/snapshots/topic04.png',
    essay: 'pdfs/topic04.pdf',
    animationContributors: [],
    essayContributors: [
      ZHIQIN_LU,
    ],
  },
  {
    name: 'Simson Line',
    index: 5,
    snapshot: 'images/snapshots/topic05.png',
    essay: 'pdfs/topic05.pdf',
    animationContributors: [
      MELISSA_YU,
    ],
    essayContributors: [
      ZHIQIN_LU,
      SHIYI_LYU,
    ],
  },
  {
    name: 'Pascal and Brainchon Theorems',
    index: 6,
    snapshot: 'images/snapshots/topic06.png',
    essay: 'pdfs/topic06.pdf',
    animationContributors: [],
    essayContributors: [
      ZHIQIN_LU,
      XIANFU_LIU,
    ],
  },
  {
    name: 'Isogonal Conjugate and Isotomic Conjugate Points',
    index: 7,
    snapshot: 'images/snapshots/topic07.png',
    essay: 'pdfs/topic07.pdf',
    animationContributors: [
      MELISSA_YU,
    ],
    essayContributors: [
      ZHIQIN_LU,
      SHIYI_LYU,
    ],
  },
  {
    name: 'Gergonne and Nagel Points',
    index: 8,
    snapshot: 'images/snapshots/topic08.png',
    essay: 'pdfs/topic08.pdf',
    animationContributors: [],
    essayContributors: [],
  },
  {
    name: "Napoleon's Theorem",
    index: 9,
    snapshot: 'images/snapshots/topic09.png',
    essay: 'pdfs/topic09.pdf',
    animationContributors: [],
    essayContributors: [
      ZHIQIN_LU,
    ],
  },
  {
    name: "Ptolemy Theorem's and Kelvin Transform",
    index: 10,
    snapshot: 'images/snapshots/topic10.png',
    essay: 'pdfs/topic10.pdf',
    animationContributors: [],
    essayContributors: [
      ZHIQIN_LU,
      FELIX_YU,
      XIANFU_LIU,
    ],
  },
  {
    name: 'Dual Triangles',
    index: 11,
    snapshot: 'images/snapshots/topic11.png',
    essay: 'pdfs/topic11.pdf',
    animationContributors: [],
    essayContributors: [
      ZHIQIN_LU,
    ],
  },
  {
    name: 'Euler Line',
    index: 12,
    snapshot: 'images/snapshots/topic12.png',
    essay: 'pdfs/topic12.pdf',
    animationContributors: [],
    essayContributors: [],
  },
  {
    name: 'Nine-point Circle',
    index: 13,
    snapshot: 'images/snapshots/topic13.png',
    essay: 'pdfs/topic13.pdf',
    animationContributors: [
      MAI_NGUYEN,
    ],
    essayContributors: [],
  },
  {
    name: 'Fermat Point',
    index: 14,
    snapshot: 'images/snapshots/topic14.png',
    essay: 'pdfs/topic14.pdf',
    animationContributors: [],
    essayContributors: [],
  },
  {
    name: 'Complete Quadrangle and Complete Qudrilateral',
    index: 15,
    snapshot: 'images/snapshots/topic15.png',
    essay: 'pdfs/topic15.pdf',
    animationContributors: [],
    essayContributors: [],
  },
  {
    name: 'Symmedian Point',
    index: 16,
    snapshot: 'images/snapshots/topic16.png',
    essay: 'pdfs/topic16.pdf',
    animationContributors: [],
    essayContributors: [],
  },
  {
    name: 'Lemoine Circles',
    index: 17,
    snapshot: 'images/snapshots/topic17.png',
    essay: 'pdfs/topic17.pdf',
    animationContributors: [],
    essayContributors: [
      ZHIQIN_LU,
    ],
  },
  {
    name: 'Lemoine Line',
    index: 18,
    snapshot: 'images/snapshots/topic18.png',
    essay: 'pdfs/topic18.pdf',
    animationContributors: [],
    essayContributors: [],
  },
  {
    name: 'Franago Triangle',
    index: 19,
    snapshot: 'images/snapshots/topic19.png',
    essay: 'pdfs/topic19.pdf',
    animationContributors: [],
    essayContributors: [],
  },
  {
    name: 'Miquel Point',
    index: 20,
    snapshot: 'images/snapshots/topic20.png',
    essay: 'pdfs/topic20.pdf',
    animationContributors: [],
    essayContributors: [
      ZHIQIN_LU,
      SHIYI_LYU,
    ],
  },
  {
    name: "Maclaurin's Theorem",
    index: 21,
    snapshot: 'images/snapshots/topic21.png',
    essay: 'pdfs/topic21.pdf',
    animationContributors: [],
    essayContributors: [],
  },
  {
    name: "Spieker's Theorem",
    index: 22,
    snapshot: 'images/snapshots/topic22.png',
    essay: 'pdfs/topic22.pdf',
    animationContributors: [],
    essayContributors: [],
  },
  {
    name: "Fuhrmann's Theorem",
    index: 23,
    snapshot: 'images/snapshots/topic23.png',
    essay: 'pdfs/topic23.pdf',
    animationContributors: [],
    essayContributors: [],
  },
  {
    name: 'Harmonic Quadrilateral',
    index: 24,
    snapshot: 'images/snapshots/topic24.png',
    essay: 'pdfs/topic24.pdf',
    animationContributors: [],
    essayContributors: [],
  },
  {
    name: 'Brocard Points',
    index: 25,
    snapshot: 'images/snapshots/topic25.png',
    essay: 'pdfs/topic25.pdf',
    animationContributors: [],
    essayContributors: [],
  },
  {
    name: 'Newton Line',
    index: 26,
    snapshot: 'images/snapshots/topic26.png',
    essay: 'pdfs/topic26.pdf',
    animationContributors: [
      MAI_NGUYEN,
    ],
    essayContributors: [
      ZHIQIN_LU,
    ],
  },
  {
    name: "Brahmagupta's Theorem",
    index: 27,
    snapshot: 'images/snapshots/topic27.png',
    essay: 'pdfs/topic27.pdf',
    animationContributors: [],
    essayContributors: [
      SATYAKI_SARKAR,
    ],
  },
  {
    name: "Davis' Theorem",
    index: 28,
    snapshot: 'images/snapshots/topic28.png',
    essay: 'pdfs/topic28.pdf',
    animationContributors: [],
    essayContributors: [
      WENJING_LIN,
    ],
  },
  {
    name: 'Tucker Circles',
    index: 29,
    snapshot: 'images/snapshots/topic29.png',
    essay: 'pdfs/topic29.pdf',
    animationContributors: [
      ZHIQIN_LU,
    ],
    essayContributors: [],
  },
  {
    name: 'Taylor Circle',
    index: 30,
    snapshot: 'images/snapshots/topic30.png',
    essay: 'pdfs/topic30.pdf',
    animationContributors: [],
    essayContributors: [
      JIMENA_ISABEL_RAZO,
    ],
  },
  {
    name: 'Quadrilateral Area Formulas',
    index: 31,
    snapshot: 'images/snapshots/topic31.png',
    essay: 'pdfs/topic31.pdf',
    animationContributors: [],
    essayContributors: [
      ZHIQIN_LU,
    ],
  },
  {
    name: "Monge's Theorem",
    index: 32,
    snapshot: 'images/snapshots/topic32.png',
    essay: 'pdfs/topic32.pdf',
    animationContributors: [],
    essayContributors: [
      MAI_NGUYEN,
    ],
  },
  {
    name: 'Isodynamic Point',
    index: 33,
    snapshot: 'images/snapshots/topic33.png',
    essay: 'pdfs/topic33.pdf',
    animationContributors: [],
    essayContributors: [],
  },
  {
    name: "Viviani' Theorem",
    index: 34,
    snapshot: 'images/snapshots/topic34.png',
    essay: 'pdfs/topic34.pdf',
    animationContributors: [],
    essayContributors: [
      YUFEI_REN,
    ],
  },
  {
    name: "Pappus' Area Theorem",
    index: 35,
    snapshot: 'images/snapshots/topic35.png',
    essay: 'pdfs/topic35.pdf',
    animationContributors: [],
    essayContributors: [
      DAWEI_LIU,
    ],
  },
  {
    name: 'Projective Harmonic Conjugate',
    index: 36,
    snapshot: 'images/snapshots/topic36.png',
    essay: 'pdfs/topic36.pdf',
    animationContributors: [],
    essayContributors: [],
  },
  {
    name: 'Trilinear Coordinate System',
    index: 37,
    snapshot: 'images/snapshots/topic37.png',
    essay: 'pdfs/topic37.pdf',
    animationContributors: [],
    essayContributors: [
      NATASHA_XIAO,
    ],
  },
  {
    name: "Routh's Theorem",
    index: 38,
    snapshot: 'images/snapshots/topic38.png',
    essay: 'pdfs/topic38.pdf',
    animationContributors: [],
    essayContributors: [
      YUE_CHU,
    ],
  },
  {
    name: "Monge's Problem",
    index: 39,
    snapshot: 'images/snapshots/topic39.png',
    essay: 'pdfs/topic39.pdf',
    animationContributors: [],
    essayContributors: [
      MAI_NGUYEN,
    ],
  },
  {
    name: "Steiner-Lehmus' Theorem",
    index: 40,
    snapshot: 'images/snapshots/topic40.png',
    essay: 'pdfs/topic40.pdf',
    animationContributors: [],
    essayContributors: [],
  },
];
