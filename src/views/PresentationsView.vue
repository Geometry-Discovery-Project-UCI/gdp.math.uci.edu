<template>
    <div>
        <ATypographyTitle :level="1">Presentations</ATypographyTitle>
        <div v-for="item in presentations" :key="item.title">
            <ATypographyTitle :level="2">{{ item.title }}</ATypographyTitle>
            <ul>
                <li v-for="name in item.contributors" :key="`${item.title}-${name}`" :style="{
                    textTransform: 'capitalize'
                }">
                    <ATypographyLink :href="`/pdfs/presentations/${item.path}/${name}.pdf`">
                        {{ name.split('_').join(' ').toLowerCase() }}'s Presentation
                    </ATypographyLink>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
const presentations = [
    {
        title: "2023 Winter Quarter",
        path: "2023/wq",
        contributors: [
            "AMELIA_FANG",
            "TINGHAI_HE",
            "CHEN_XU",
            "XIAOXUAN_LI",
            "JINGXIN_CAI",
            "XINYU_XU",
            "KIRA_ZHANG",
            "YIDING_HUANG",
            "MINGYAN_XU",
            "YI_YANG",
            "MUFAN_ZHANG",
            "YU_FENG",
            "SHALLY_FAN",
            "ZHIBO_CHENG",
            "SHUCHENG_FEI",
            "ZHUOYI_HE"
        ]
    },
    {
        title: "2023 Spring Quarter",
        path: "2023/sq",
        contributors: [
           "HANSON_HU",
           "YIDING_HUANG",
           "YUXIAO_HUANG",
           "YUKANG_LI",
           "XUANRU_LI",
           "YUFEI_REN",
           "JIAHUI_SHENG",
           "KE_SU",
           "JIANGYAO SUN",
           "LINGLIN_TIAN",
           "JINGXI_WANG",
           "WILLA_WANG",
           "NINGYUE_XU",
            "LU_YANG",
            "SHENGKAI_YANG"
        ]
    }
];
</script>
