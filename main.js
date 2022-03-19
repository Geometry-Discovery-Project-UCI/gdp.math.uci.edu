{
    const innerContent = document.getElementById("inner-content");
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
                    new Topic("Five Triangle Cneters", ["Zhiqin Lu", "Shiyi Lyu", "Xinxi Guo"], "public/images/topic03.png", "topics/topic03"),
                ]
            }
        },
        methods: {
            reloadInnerContent(topic) {
                innerContent.src = topic.pageUrl;
            }
        }
    }).mount("#topic-list");
}