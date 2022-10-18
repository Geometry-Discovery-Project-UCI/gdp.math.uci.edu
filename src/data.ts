import { Contributor, Topic } from "@/types";

export enum Institute {
  UCIrvine = "UC Irvine",
  UCSanDiego = "UC San Diego"
}

// TODO(Kiyo5hi): Use enum for contributors
// Known issue: https://github.com/microsoft/TypeScript/issues/40793
export const BRIAN_CABALLERO: Contributor = {
  name: "Brian Caballero",
  email: "bacaball@uci.edu",
  institute: Institute.UCIrvine,
};

export const CECHENG_CAO: Contributor = {
  name: "Cecheng Cao",
  email: "cechengc@uci.edu",
  institute: Institute.UCIrvine,
};

export const YI_CHEN: Contributor = {
  name: "Yi Chen",
  email: "yic40@uci.edu",
  institute: Institute.UCIrvine,
};

export const YUE_CHU: Contributor = {
  name: "Yue Chu",
  email: "chuy13@uci.edu",
  institute: Institute.UCIrvine,
};

export const ISHAN_DARJI: Contributor = {
  name: "Ishan Darji",
  email: "ishan.darji0@gmail.com"
};

export const CHRISTOPHER_DAVIS: Contributor = {
  name: "Christopher Davis",
  email: "daviscj@uci.edu",
  institute: Institute.UCIrvine,
};

export const RUOYING_DENG: Contributor = {
  name: "Ruoying Deng",
  email: "ruoyind1@uci.edu",
  institute: Institute.UCIrvine,
};

export const JIAMING_FENG: Contributor = {
  name: "Jiaming Feng",
  email: "jiamif3@uci.edu",
  institute: Institute.UCIrvine,
};

export const BIN_GUO: Contributor = {
  name: "Bin Guo",
  email: "bing3@uci.edu",
  institute: Institute.UCIrvine,
};

export const XINXI_GUO: Contributor = {
  name: "Xinxi Guo",
  email: "x6guo@ucsd.edu",
  institute: Institute.UCSanDiego,
};

export const VINNIE_HSIA: Contributor = {
  name: "Vinnie Hsia",
  email: "hsiat1@uci.edu",
  institute: Institute.UCIrvine,
};
export const SHAOCHENG_HSU: Contributor = {
  name: "SHAOCHENG Hsu",
  email: "ecsonh@uci.edu",
  institute: Institute.UCIrvine,
};

export const JIANLIN_LI: Contributor = {
  name: "Jianlin Li",
  email: "jianlil2@uci.edu",
  institute: Institute.UCIrvine,
};

export const TONGTONG_LI: Contributor = {
  name: "Tongtong Li",
  email: "tongtl3@uci.edu",
  institute: Institute.UCIrvine,
};

export const YIXUAN_LI: Contributor = {
  name: "Yixuan Li",
  email: "yixual44@uci.edu",
  institute: Institute.UCIrvine,
};

export const WENJING_LIN: Contributor = {
  name: "Wenjing Lin",
  email: "wenjinl8@uci.edu",
  institute: Institute.UCIrvine,
};

export const DAWEI_LIU: Contributor = {
  name: "Dawei Liu",
  email: "daweil7@uci.edu",
  institute: Institute.UCIrvine,
};

export const XIANFU_LIU: Contributor = {
  name: "Xianfu Liu",
  email: "xianful@uci.edu",
  institute: Institute.UCIrvine,
};

export const ZHIQIN_LU: Contributor = {
  name: "Zhiqin Lu",
  email: "zlu@uci.edu",
  institute: Institute.UCIrvine,
};

export const SHIYI_LYU: Contributor = {
  name: "Shiyi Lyu",
  email: "slyu6@uci.edu",
  institute: Institute.UCIrvine,
};

export const RUSSELL_MARASIGAN: Contributor = {
  name: "Russell Marasigan",
  email: "marasigr@uci.edu",
  institute: Institute.UCIrvine,
};

export const MAI_NGUYEN: Contributor = {
  name: "Mai Nguyen",
  email: "main5@uci.edu",
  institute: Institute.UCIrvine,
};

export const JIMENA_ISABEL_RAZO: Contributor = {
  name: "Jimena Isabel Razo",
  email: "razoji@uci.edu",
  institute: Institute.UCIrvine,
};

export const YUFEI_REN: Contributor = {
  name: "Yufei Ren",
  email: "yufeir@uci.edu",
  institute: Institute.UCIrvine,
};

export const SATYAKI_SARKAR: Contributor = {
  name: "Satyaki Sarkar",
  email: "satyakis@uci.edu",
  institute: Institute.UCIrvine,
};

export const MINGYU_SHI: Contributor = {
  name: "Mingyu Shi",
  email: "mingyus3@uci.edu",
  institute: Institute.UCIrvine,
};

export const CHUXIANGBO_WANG: Contributor = {
  name: "Chuxiangbo Wang",
  email: "chuxianw@uci.edu",
  institute: Institute.UCIrvine,
};

export const STEPHANIE_WANG: Contributor = {
  name: "Stephanie Wang",
  email: "stephjw1@uci.edu",
  institute: Institute.UCIrvine,
};

export const NATASHA_XIAO: Contributor = {
  name: "Natasha Xiao",
  email: "jxiao12@uci.edu",
  institute: Institute.UCIrvine,
};

export const ZEJIN_XU: Contributor = {
  name: "Zejin Xu",
  email: "zejinx@uci.edu",
  institute: Institute.UCIrvine,
};

export const FELIX_YU: Contributor = {
  name: "Felix Yu",
  email: "felixyu2627@gmail.com",
};

export const MELISSA_YU: Contributor = {
  name: "Melissa Yu",
  email: "melissajiayu@gmail.com",
};

export const contributors: Contributor[] = [
  ZHIQIN_LU,
  BRIAN_CABALLERO,
  CECHENG_CAO,
  ISHAN_DARJI,
  CHRISTOPHER_DAVIS,
  XIANFU_LIU,
  YI_CHEN,
  YUE_CHU,
  RUOYING_DENG,
  JIAMING_FENG,
  BIN_GUO,
  XINXI_GUO,
  VINNIE_HSIA,
  SHAOCHENG_HSU,
  JIANLIN_LI,
  TONGTONG_LI,
  YIXUAN_LI,
  WENJING_LIN,
  SHIYI_LYU,
  RUSSELL_MARASIGAN,
  MAI_NGUYEN,
  JIMENA_ISABEL_RAZO,
  YUFEI_REN,
  SATYAKI_SARKAR,
  MINGYU_SHI,
  CHUXIANGBO_WANG,
  STEPHANIE_WANG,
  NATASHA_XIAO,
  ZEJIN_XU,
  FELIX_YU,
  MELISSA_YU,
].sort((a, b) => {
  const aLastName = a.name.split(" ").pop() as string;
  const bLastName = b.name.split(" ").pop() as string;

  const diffInLastName = aLastName.localeCompare(bLastName);
  if (diffInLastName !== 0) {
    return diffInLastName;
  }

  const aFirstName = a.name.split(" ")[0];
  const bFirstName = b.name.split(" ")[0];
  return aFirstName.localeCompare(bFirstName);
}
);

export const otherEssays: { name: string, uri: string }[] = [
  {
    name: "The 20 degree questions",
    uri: "pdfs/twenty-one.pdf",
  },
  {
    name: "The usage of special techniques",
    uri: "pdfs/special-techniques.pdf",
  },
];

export const otherLinks: { name: string, uri: string, author?: string }[] = [
  {
    name: "Geometry Unbound",
    uri: "https://kskedlaya.org/geometryunbound/",
    author: "Kiran Kedlaya",
  },
  {
    name: "UCI Math Circle",
    uri: "https://www.math.uci.edu/~mathcircle/",
  },
  {
    name: "Fullerton Math Circle",
    uri: "https://www.fullerton.edu/math/resources/mathcircle.php",
  },
  {
    name: "Morning Star Institue",
    uri: "http://www.morningstarinstitute.org/",
    author: "Yifeng Yu",
  },
];

export const topics: Topic[] = [
  {
    name: "Morley's Miracle",
    index: 1,
    snapshot: "images/snapshots/topic01.png",
    essay: "pdfs/topic01.pdf",
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
    snapshot: "images/snapshots/topic02.png",
    essay: "pdfs/topic02.pdf",
    animationContributors: [
      MAI_NGUYEN,
      JIANLIN_LI,
    ],
    essayContributors: [
      ZHIQIN_LU,
      XIANFU_LIU,
    ],
  },
  {
    name: "Five Triangle Centers",
    index: 3,
    snapshot: "images/snapshots/topic03.png",
    essay: "pdfs/topic03.pdf",
    animationContributors: [
      XINXI_GUO,
      YI_CHEN,
    ],
    essayContributors: [
      ZHIQIN_LU,
      SHIYI_LYU,
    ],
  },
  {
    name: "Erdős-Mordell Inequality",
    index: 4,
    snapshot: "images/snapshots/topic04.png",
    essay: "pdfs/topic04.pdf",
    animationContributors: [
      MELISSA_YU
    ],
    essayContributors: [
      ZHIQIN_LU,
    ],
  },
  {
    name: "Simson Line",
    index: 5,
    snapshot: "images/snapshots/topic05.png",
    essay: "pdfs/topic05.pdf",
    animationContributors: [
      MELISSA_YU,
      YIXUAN_LI,
    ],
    essayContributors: [
      ZHIQIN_LU,
      SHIYI_LYU,
    ],
  },
  {
    name: "Pascal and Brainchon Theorems",
    index: 6,
    snapshot: "images/snapshots/topic06.png",
    essay: "pdfs/topic06.pdf",
    animationContributors: [ZEJIN_XU],
    essayContributors: [
      ZHIQIN_LU,
      XIANFU_LIU,
    ],
  },
  {
    name: "Isogonal Conjugate and Isotomic Conjugate Points",
    index: 7,
    snapshot: "images/snapshots/topic07.png",
    essay: "pdfs/topic07.pdf",
    animationContributors: [
      MELISSA_YU,
    ],
    essayContributors: [
      ZHIQIN_LU,
      SHIYI_LYU,
    ],
  },
  {
    name: "Gergonne and Nagel Points",
    index: 8,
    snapshot: "images/snapshots/topic08.png",
    essay: "pdfs/topic08.pdf",
    animationContributors: [
      YIXUAN_LI,
    ],
    essayContributors: [],
  },
  {
    name: "Napoleon's Theorem",
    index: 9,
    snapshot: "images/snapshots/topic09.png",
    essay: "pdfs/topic09.pdf",
    animationContributors: [
      JIANLIN_LI,
    ],
    essayContributors: [
      ZHIQIN_LU,
    ],
  },
  {
    name: "Ptolemy Theorem's and Kelvin Transform",
    index: 10,
    snapshot: "images/snapshots/topic10.png",
    essay: "pdfs/topic10.pdf",
    animationContributors: [],
    essayContributors: [
      ZHIQIN_LU,
      FELIX_YU,
      XIANFU_LIU,
    ],
  },
  {
    name: "Dual Triangles",
    index: 11,
    snapshot: "images/snapshots/topic11.png",
    essay: "pdfs/topic11.pdf",
    animationContributors: [],
    essayContributors: [
      ZHIQIN_LU,
    ],
  },
  {
    name: "Euler Line",
    index: 12,
    snapshot: "images/snapshots/topic12.png",
    essay: "pdfs/topic12.pdf",
    animationContributors: [VINNIE_HSIA],
    essayContributors: [
      CHUXIANGBO_WANG,
    ],
  },
  {
    name: "Nine-point Circle",
    index: 13,
    snapshot: "images/snapshots/topic13.png",
    essay: "pdfs/topic13.pdf",
    animationContributors: [
      MAI_NGUYEN,
    ],
    essayContributors: [
      RUSSELL_MARASIGAN,
      MAI_NGUYEN,
    ],
  },
  {
    name: "Fermat Point",
    index: 14,
    snapshot: "images/snapshots/topic14.png",
    essay: "pdfs/topic14.pdf",
    animationContributors: [MELISSA_YU],
    essayContributors: [],
  },
  {
    name: "Complete Quadrangle and Complete Qudrilateral",
    index: 15,
    snapshot: "images/snapshots/topic15.png",
    essay: "pdfs/topic15.pdf",
    animationContributors: [],
    essayContributors: [],
  },
  {
    name: "Symmedian Point",
    index: 16,
    snapshot: "images/snapshots/topic16.png",
    essay: "pdfs/topic16.pdf",
    animationContributors: [],
    essayContributors: [],
  },
  {
    name: "Lemoine Circles",
    index: 17,
    snapshot: "images/snapshots/topic17.png",
    essay: "pdfs/topic17.pdf",
    animationContributors: [
      JIANLIN_LI,
    ],
    essayContributors: [
      ZHIQIN_LU,
    ],
  },
  {
    name: "Lemoine Line",
    index: 18,
    snapshot: "images/snapshots/topic18.png",
    essay: "pdfs/topic18.pdf",
    animationContributors: [ZEJIN_XU],
    essayContributors: [],
  },
  {
    name: "Franago Triangle",
    index: 19,
    snapshot: "images/snapshots/topic19.png",
    essay: "pdfs/topic19.pdf",
    animationContributors: [VINNIE_HSIA],
    essayContributors: [],
  },
  {
    name: "Miquel Point",
    index: 20,
    snapshot: "images/snapshots/topic20.png",
    essay: "pdfs/topic20.pdf",
    animationContributors: [
      YIXUAN_LI,
    ],
    essayContributors: [
      ZHIQIN_LU,
      SHIYI_LYU,
    ],
  },
  {
    name: "Maclaurin's Theorem",
    index: 21,
    snapshot: "images/snapshots/topic21.png",
    essay: "pdfs/topic21.pdf",
    animationContributors: [],
    essayContributors: [],
  },
  {
    name: "Spieker's Theorem",
    index: 22,
    snapshot: "images/snapshots/topic22.png",
    essay: "pdfs/topic22.pdf",
    animationContributors: [],
    essayContributors: [],
  },
  {
    name: "Fuhrmann's Theorem",
    index: 23,
    snapshot: "images/snapshots/topic23.png",
    essay: "pdfs/topic23.pdf",
    animationContributors: [],
    essayContributors: [],
  },
  {
    name: "Harmonic Quadrilateral",
    index: 24,
    snapshot: "images/snapshots/topic24.png",
    essay: "pdfs/topic24.pdf",
    animationContributors: [
      YIXUAN_LI,
    ],
    essayContributors: [
      RUOYING_DENG,
    ],
  },
  {
    name: "Brocard Points",
    index: 25,
    snapshot: "images/snapshots/topic25.png",
    essay: "pdfs/topic25.pdf",
    animationContributors: [],
    essayContributors: [],
  },
  {
    name: "Newton Line",
    index: 26,
    snapshot: "images/snapshots/topic26.png",
    essay: "pdfs/topic26.pdf",
    animationContributors: [
      MAI_NGUYEN,
    ],
    essayContributors: [
      MINGYU_SHI,
    ],
  },
  {
    name: "Brahmagupta's Theorem",
    index: 27,
    snapshot: "images/snapshots/topic27.png",
    essay: "pdfs/topic27.pdf",
    animationContributors: [],
    essayContributors: [
      SATYAKI_SARKAR,
    ],
  },
  {
    name: "Davis' Theorem",
    index: 28,
    snapshot: "images/snapshots/topic28.png",
    essay: "pdfs/topic28.pdf",
    animationContributors: [],
    essayContributors: [
      WENJING_LIN,
    ],
  },
  {
    name: "Tucker Circles",
    index: 29,
    snapshot: "images/snapshots/topic29.png",
    essay: "pdfs/topic29.pdf",
    animationContributors: [
      ZHIQIN_LU,
      VINNIE_HSIA,
    ],
    essayContributors: [],
  },
  {
    name: "Taylor Circle",
    index: 30,
    snapshot: "images/snapshots/topic30.png",
    essay: "pdfs/topic30.pdf",
    animationContributors: [
      YI_CHEN,
    ],
    essayContributors: [
      JIMENA_ISABEL_RAZO,
    ],
  },
  {
    name: "Quadrilateral Area Formulas",
    index: 31,
    snapshot: "images/snapshots/topic31.png",
    essay: "pdfs/topic31.pdf",
    animationContributors: [
      YIXUAN_LI,
    ],
    essayContributors: [
      ZHIQIN_LU,
    ],
  },
  {
    name: "Monge's Theorem",
    index: 32,
    snapshot: "images/snapshots/topic32.png",
    essay: "pdfs/topic32.pdf",
    animationContributors: [VINNIE_HSIA],
    essayContributors: [
      MAI_NGUYEN,
    ],
  },
  {
    name: "Isodynamic Point",
    index: 33,
    snapshot: "images/snapshots/topic33.png",
    essay: "pdfs/topic33.pdf",
    animationContributors: [],
    essayContributors: [],
  },
  {
    name: "Viviani' Theorem",
    index: 34,
    snapshot: "images/snapshots/topic34.png",
    essay: "pdfs/topic34.pdf",
    animationContributors: [
      ISHAN_DARJI,
    ],
    essayContributors: [
      YUFEI_REN,
    ],
  },
  {
    name: "Pappus' Area Theorem",
    index: 35,
    snapshot: "images/snapshots/topic35.png",
    essay: "pdfs/topic35.pdf",
    animationContributors: [MELISSA_YU],
    essayContributors: [
      DAWEI_LIU,
    ],
  },
  {
    name: "Projective Harmonic Conjugate",
    index: 36,
    snapshot: "images/snapshots/topic36.png",
    essay: "pdfs/topic36.pdf",
    animationContributors: [YI_CHEN],
    essayContributors: [
      JIAMING_FENG,
    ],
  },
  {
    name: "Trilinear Coordinate System",
    index: 37,
    snapshot: "images/snapshots/topic37.png",
    essay: "pdfs/topic37.pdf",
    animationContributors: [
      YIXUAN_LI,
    ],
    essayContributors: [
      NATASHA_XIAO,
    ],
  },
  {
    name: "Routh's Theorem",
    index: 38,
    snapshot: "images/snapshots/topic38.png",
    essay: "pdfs/topic38.pdf",
    animationContributors: [
      JIANLIN_LI,
    ],
    essayContributors: [
      YUE_CHU,
    ],
  },
  {
    name: "Monge's Problem",
    index: 39,
    snapshot: "images/snapshots/topic39.png",
    essay: "pdfs/topic39.pdf",
    animationContributors: [],
    essayContributors: [
      MAI_NGUYEN,
    ],
  },
  {
    name: "Steiner-Lehmus' Theorem",
    index: 40,
    snapshot: "images/snapshots/topic40.png",
    essay: "pdfs/topic40.pdf",
    animationContributors: [],
    essayContributors: [
      TONGTONG_LI,
    ],
  },
];

export const indexTopicMap: Map<number, Topic> = new Map(
  topics.map((topic) => [topic.index, topic]),
);

export const otherImages: { title: string, image: string }[] = [
  {
    title: "2022 Spring GDP Group",
    image: "images/group/2022-Spring-199C-1.jpg",
  }, {
    title: "2022 Spring GDP Group",
    image: "images/group/2022-Spring-199C-2.jpg",
  }, {
    title: "2022 Winter GDP Group",
    image: "images/group/2022-Winter-199B.jpg",
  },
];
