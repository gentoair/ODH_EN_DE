/* global api */
class ende_Collins {
    constructor(options) {
        this.options = options;
        this.maxexample = 2;
        this.word = '';
    }

    async displayName() {
        let locale = await api.locale();
        if (locale.indexOf('CN') != -1) return 'Collins EN->DE Dictionary';
        if (locale.indexOf('TW') != -1) return 'Collins EN->DE Dictionary';
        return 'Collins EN->DE Dictionary';
    }

    setOptions(options) {
        this.options = options;
        this.maxexample = options.maxexample;
    }

    async findTerm(word) {
        this.word = word;
        return await this.findCollins(word);
    }

    async findCollins(word) {
        if (!word) return null;

        let base = 'https://www.collinsdictionary.com/dictionary/english-german/';
        let url = base + encodeURIComponent(word);
        let doc = '';
        try {
            let data = await api.fetch(url);
            let parser = new DOMParser();
            doc = parser.parseFromString(data, 'text/html');
        } catch (err) {
            return null;
        }

        let content = doc.querySelector('.content') || '';
        let pron = doc.querySelector('.form.pron') || '';
        if (!content) return null;
        let css = this.renderCSS();
        if (!pron) return css + content.innerHTML; 
        else return css + pron.innerHTML + content.innerHTML;
    }

    renderCSS() {
        let css = `
            <style>
                .pronIPASymbol {
                    display:none;
                }
                .copyright {
                    display:none;
                }
                .orth {
                    font-size: 100%;
                    font-weight: bold;
                }
                 .lbl.type-syn {
                    font-style: italic;
                    font-size: 90%;
                    color: #262323;
                }
                .pos {
                    font-style: normal;
                    font-weight: bold;
                }
                .bold {
                    font-style: normal;
                    font-weight: bold;
                }
                .quote.ref {
                    font-style: normal;
                    font-weight: bold;
                    font-size: 120%;
                    color: #be1616;
                }
                .cit.type-example {
                    font-style: normal;
                    font-weight: bold;
                    color: #a7b1c8;
                }
                .cit.type-translation {
                    font-style: normal;
                    font-weight: bold;
                    color: #262323;
                }
                .lbl.type-misc {
                    font-style: italic;
                    color: #262323;
                }
                .colloc {
                    font-style: italic;
                    font-weight: normal;
                }
                .sense {
                    /*border: 1px solid;*/
                    /*border-color: #e5e6e9 #dfe0e4 #d0d1d5;*/
                    border-radius: 3px;
                    padding: 5px;
                    margin: 5px 0;
                    background-color: #f6f6f6;
                }
                .sense.re {
                    font-size: 100%;
                    margin-left: 0;
                }
                a {
                    color: #000;
                    /*text-decoration: none;*/
                }
                * {
                    word-wrap: break-word;
                    box-sizing: border-box;
                }
            </style>`;

        return css;
    }
}
