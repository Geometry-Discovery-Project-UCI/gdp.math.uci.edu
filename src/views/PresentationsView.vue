<template>
    <div>
        <ATypographyTitle :level="1">Presentations</ATypographyTitle>
        <div v-for="(names, year) in years" :key="year">
            <ATypographyTitle :level="2">{{ year }}</ATypographyTitle>
            <ul>
                <li v-for="name in names" :key="`${year}-${name}`" :style="{
                    textTransform: 'capitalize'
                }">
                    <ATypographyLink :href="`/pdfs/wq-presentations/${year}/${name}.pdf`">
                        {{ name.split('_').join(' ').toLowerCase() }}'s Presentation
                    </ATypographyLink>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
const years = {
    2023: [
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
};
</script>
