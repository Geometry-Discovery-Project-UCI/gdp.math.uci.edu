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
                    new Topic("Five Triangle Centers", ["Zhiqin Lu", "Shiyi Lyu"], "public/images/topic03.png", "topics/topic03"),
                    new Topic("Erdős-Mordell Inequality", ["Zhiqin Lu"], "public/images/topic04.png", "topics/topic04"),
                    new Topic("Simson Line", ["Zhiqin Lu", "Shiyi Lyu"], "public/images/topic05.png", "topics/topic05"),
                    new Topic("Pascal and Brainchon Theorems", ["Zhiqin Lu", "Xianfu Liu"], "public/images/topic06.png", "topics/topic06"),
                    new Topic("Isogonal Conjugate and Isotomic Conjugate Points", ["Zhiqin Lu", "Shiyi Lyu"], "public/images/topic07.png", "topics/topic07"),
                    new Topic("Gergonne and Nagel Points", [], "public/images/topic08.png", "topics/topic08"),
                    new Topic("Napoleon's Theorem", ["Zhiqin Lu"], "public/images/topic09.png", "topics/topic09"),
                    new Topic("Ptolemy Theorem's and Kelvin Transform", ["Zhiqin Lu", "Felix Yu", "Xianfu Liu"], "public/images/topic10.png", "topics/topic10"),
                    new Topic("Dual Triangles", ["Zhiqin Lu"], "public/images/topic11.png", "topics/topic11"),
                    new Topic("Euler Line", [], "public/images/topic12.png", "topics/topic12"),
                    new Topic("Nine-point Circle", [], "public/images/topic13.png", "topics/topic13"),
                    new Topic("Fermat Point", [], "public/images/topic14.png", "topics/topic14"),
                    new Topic("Complete Quadrangle and Complete Qudrilateral", [], "public/images/topic15.png", "topics/topic15"),
                    new Topic("Symmedian Point", [], "public/images/topic16.png", "topics/topic16"),
                    new Topic("Lemoine Circles", ["Zhiqin Lu"], "public/images/topic17.png", "topics/topic17"),
                    new Topic("Lemoine Line", [], "public/images/topic18.png", "topics/topic18"),
                    new Topic("Franago Triangle", [], "public/images/topic19.png", "topics/topic19"),
                    new Topic("Miquel Point", ["Zhiqin Lu", "Shiyi Lyu"], "public/images/topic20.png", "topics/topic20"),
                    new Topic("Maclaurin's Theorem", [], "public/images/topic21.png", "topics/topic21"),
                    new Topic("Spieker's Theorem", [], "public/images/topic22.png", "topics/topic22"),
                    new Topic("Fuhrmann's Theorem", [], "public/images/topic23.png", "topics/topic23"),
                    new Topic("Harmonic Quadrilateral", [], "public/images/topic24.png", "topics/topic24"),
                    new Topic("Brocard Points", [], "public/images/topic25.png", "topics/topic25"),
                    new Topic("Newton Line", [], "public/images/topic26.png", "topics/topic26"),
                    new Topic("Brahmagupta's Theorem", ["Satyaki Sarkar"], "public/images/topic27.png", "topics/topic27"),
                    new Topic("Davis' Theorem", [], "public/images/topic28.png", "topics/topic28"),
                    new Topic("Tucker Circles", [], "public/images/topic29.png", "topics/topic29"),
                    new Topic("Taylor Circle", [], "public/images/topic30.png", "topics/topic30"),
                    new Topic("Quadrilateral Area Formulas", ["Zhiqin Lu"], "public/images/topic31.png", "topics/topic31"),
                    new Topic("Monge's Theorem", [], "public/images/topic32.png", "topics/topic32"),
                    new Topic("Isodynamic Point", [], "public/images/topic33.png", "topics/topic33"),
                    new Topic("Viviani' Theorem", [], "public/images/topic34.png", "topics/topic34"),
                    new Topic("Pappus' Area Theorem", [], "public/images/topic35.png", "topics/topic35"),
                    new Topic("Projective Harmonic Conjugate", [], "public/images/topic36.png", "topics/topic36"),
                    new Topic("Trilinear Coordinate System", ["Natasha Xiao"], "public/images/topic37.png", "topics/topic37"),
                    new Topic("Routh' Theorem", ["Yeu Chu"], "public/images/topic38.png", "topics/topic38"),
                    

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