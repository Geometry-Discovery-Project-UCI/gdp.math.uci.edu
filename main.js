{
    const main = document.getElementById("main-content");
    class Topic {
        constructor(title, authors, imageUrl, pageUrl) {
            this.title = title;
            this.authors = authors;
            this.imageUrl = imageUrl;
            this.pageUrl = pageUrl;
        }
    }

    Vue.createApp({
        data() {
            return {
                topics: [
                    new Topic("Morley's Miracle", ["Zhiqin Lu"], "public/images/topic01.png", "topics/topic01"),
                    new Topic("Ceva's and Menelaus' Theorems", ["Zhiqin Lu", "Xianfu Liu"], "public/images/topic02.png", "topics/topic02"),
                    new Topic("Five Triangle Centers", ["Zhiqin Lu", "Shiyi Lyu", "Xinxi Guo"], "public/images/topic03.png", "topics/topic03"),
                    new Topic("Erdős-Mordell Inequality", ["Zhiqin Lu"], "public/images/topic04.png", "topics/topic04"),
                    new Topic("Simson Line", ["Zhiqin Lu"], "public/images/topic05.png", "topics/topic05"),
                    new Topic("Pascal and Brainchon Theorems", ["Zhiqin Lu", "Xianfu Liu"], "public/images/topic06.png", "topics/topic06"),
                    new Topic("Isogonal Conjugate and Isotomic Conjugate Points", ["Zhiqin Lu", "Shiyi Lyu"], "public/images/topic07.png", "topics/topic07"),
                    new Topic("Gergonne and Nagel Points", [], "public/images/topic08.png", "topics/topic08"),
                    new Topic("Napoleon's Theorem", ["Zhiqin Lu"], "public/images/topic09.png", "topics/topic09"),
                    new Topic("Ptolemy Theorem's and Kelvin Transform", ["Zhiqin Lu"], "public/images/topic10.png", "topics/topic10"),
                    new Topic("Dual Triangles", ["Zhiqin Lu"], "public/images/topic11.png", "topics/topic11"),
                    new Topic("Lemoine Circles", ["Zhiqin Lu"], "public/images/topic17.png", "topics/topic17"),
                ]
            }
        },
        methods: {
            reloadMainContent(topic) {
                main.src = topic.pageUrl;
            }
        }
    }).mount("#topic-list");
}