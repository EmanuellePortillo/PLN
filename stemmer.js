var Stemmer = {
    is_vowel: function(c){
        var vowel = ['a','e','i','o','u','á','é','í','ó','ú'];
        return (vowel.indexOf(c));
    },
    getNextVowelPos:function(word,start){
        start = start | 0;
        var len = word.length;
        for (var index = start; index < len; index++) {
            if(this.is_vowel(word.substr(index,1))){
                return index;
            }
        }
        return len;
    },
    getNextConsonanPos: function(word,start){
        start = start | 0;
        var len = word.length;
        for (var index = start; index < len; index++) {
            if(!this.is_vowel(word.substr(index,1))){
                return index;
            }
        }
        return len;
    },
    endsin: function(word,suffix){
        if(word.length < suffix.length){
            return 0;
        }
        return (word.substr(-suffix.length)==suffix);
    },
    endsinArr: function(word,suffixes){
        for (var index = 0; index < suffixes.length; index++) {
            if(this.endsin(word,suffixes[index]) != 0){
                return suffixes[index];
            }            
        }
        return '';
    },
    removeAccent: function(word){
        var search = ['á','é','í','ó','ú'];
        var replace = ['a','e','i','o','u'];
        return word.replaceArray(search,replace); 
    },
    stemm: function(word){
        var len = word.length;
        if(len <= 2){
            return word;
        }
        word = word.toLowerCase();
        var rv = r2 = r1 = len;
        
        //R1 is the region after the first non-vowel following a vowel, or is the null region at the end of the word if there is no such non-vowel.
        for (var index = 0; index < len-1 && r1 == len; index++) {
            if(this.is_vowel(word.substr(index,1)) && !this.is_vowel(word.substr(index+1,1))){
                r1 = index + 2;
            }            
        }
        
        //R2 is the region after the first non-vowel following a vowel in R1, or is the null region at the end of the word if there is no such non-vowel.
        for (var index = r1; index < len-1 && r2 == len; index++) {
            if(this.is_vowel(word.substr(index,1)) && !this.is_vowel(word.substr(index+1,1))){
                r2 = index + 2;
            }            
        }
        
        if(len > 3){
            if(this.is_vowel(word.substr(1,1))){
                // If the second letter is a consonant, RV is the region after the next following vowel
                rv = this.getNextVowelPos(word,2) + 1;
            }else if(this.is_vowel(word.substr(0,1)) && this.is_vowel(word.substr(1,1))){
                //or if the first two letters are vowels, RV is the region after the next consonant
                rv = this.getNextConsonanPos(word,2) + 1;
            }else{
                //otherwise (consonant-vowel case) RV is the region after the third letter. But RV is the end of the word if these positions cannot be found.
                rv = 3;
            }
            
            var r1_txt = word.substr(r1);
            var r2_txt = word.substr(r2);
            var rv_txt = word.substr(rv);
            var word_orig = word;
            
            //Step 0: Attached pronoun
            var pronoun_suf = ['me', 'se', 'sela', 'selo', 'selas', 'selos', 'la', 'le', 'lo', 'las', 'les', 'los', 'nos'];
            var pronoun_suf_pre1 = ['éndo', 'ándo', 'ár', 'ér', 'ír'];
            var pronoun_suf_pre2 = ['ando', 'iendo', 'ar', 'er', 'ir'];
            var suf = this.endsinArr(word,pronoun_suf);
            if(suf != ''){
                var pre_suff = this.endsinArr(rv_txt.substr(0,-suf.length),pronoun_suf_pre1);
                if (pre_suff != ''){
                    word = this.removeAccent(word.substr(0,-suf.length));
                }else{
                    pre_suff = this.endsinArr(rv_txt.substr(0,-suf.length),pronoun_suf_pre2);
                    if(pre_suff != '' || (this.endsin(word,'yendo') && word.substr(-suf.length-6,1) == 'u')){
                        word = word.substr(0,-suf.len);
                    }
                }
            }
            
            if(word != word_orig){
                r1_txt = word.substr(r1);
                r2_txt = word.substr(r2);
                rv_txt = word.substr(rv);
            }
            word_after0 = word;
            
            if((suf = this.endsinArr(r2_txt,['anza', 'anzas', 'ico', 'ica', 'icos', 'icas', 'ismo', 'ismos', 'able', 'ables', 'ible', 'ibles', 'ista', 'istas', 'oso', 'osa', 'osos', 'osas', 'amiento', 'amientos', 'imiento', 'imientos'])) != ''){
                word = word.substr(0,-suf.length);
            }else if((suf = this.endsinArr(r2_txt,['icadora', 'icador', 'icación', 'icadoras', 'icadores', 'icaciones', 'icante', 'icantes', 'icancia', 'icancias', 'adora', 'ador', 'ación', 'adoras', 'adores', 'aciones', 'ante', 'antes', 'ancia', 'ancias'])) != ''){
                word = word.substr(0,-suf.length);
            }else if((suf = this.endsinArr(r2_txt,['logía','logías'])) != ''){
                word = word.substr(0,-suf.length); + 'log';
            }else if((suf = this.endsinArr(r2_txt,['ución','uciones'])) != ''){
                word = word.substr(0,-suf.length); + 'ente';
            }else if((suf = this.endsinArr(r2_txt,['ativamente', 'ivamente', 'osamente', 'icamente', 'adamente']))!=''){
                word = word.substr(0,-suf.length);
            }else if((suf = this.endsinArr(r2_txt,['amente'])) != ''){
                word = word.substr(0,-suf.length);
            }else if((suf = this.endsinArr(r2_txt,['antemente', 'ablemente', 'iblemente', 'mente']))!=''){
                word = word.substr(0,-suf.length);
            }else if((suf = this.endsinArr(r2_txt,['abilidad', 'abilidades', 'icidad', 'icidades', 'ividad', 'ividades', 'idad', 'idades']))!=''){
                word = word.substr(0,-suf.length);
            }else if((suf = this.endsinArr(r2_txt,['ativa', 'ativo', 'ativas', 'ativos', 'iva', 'ivo', 'ivas', 'ivos']))!=''){
                word = word.substr(0,-suf.length);
            }
            
            if(word != word_after0){
                r1_txt = word.substr(r1);
                r2_txt = word.substr(r2);
                rv_txt = word.substr(rv);
            }
            var word_after1 = word;
            
            if(word_after0 == word_after1){
                //Do step 2a if no ending was removed by step 1. 
                if((suf = this.endsinArr(rv_txt,['ya', 'ye', 'yan', 'yen', 'yeron', 'yendo', 'yo', 'yó', 'yas', 'yes', 'yais', 'yamos'])) != '' && word.substr(-suf.length-1,1) == 'u'){
                    word = word.substr(0,-suf.length);
                }
                
                if(word == word_after1){
                    r1_txt = word.substr(r1);
                    r2_txt = word.substr(r2);
                    rv_txt = word.substr(rv);
                }
                var word_after2a = word;
                
                //Do Step 2b if step 2a was done, but failed to remove a suffix. 
                if(word_after2a == word_after1){
                    if((suf = this.endsinArr(rv_txt,['en','es','éis','emos'])) != ''){
                        word = word.substr(0,-suf.length);
                        if(this.endsin(word,'gu')){
                            word = word.substr(0,-1);
                        }
                    }else if((suf = this.endsinArr(rv_txt,['arían', 'arías', 'arán', 'arás', 'aríais', 'aría', 'aréis', 'aríamos', 'aremos', 'ará', 'aré', 'erían', 'erías', 'erán', 'erás', 'eríais', 'ería', 'eréis', 'eríamos', 'eremos', 'erá', 'eré', 'irían', 'irías', 'irán', 'irás', 'iríais', 'iría', 'iréis', 'iríamos', 'iremos', 'irá', 'iré', 'aba', 'ada', 'ida', 'ía', 'ara', 'iera', 'ad', 'ed', 'id', 'ase', 'iese', 'aste', 'iste', 'an', 'aban', 'ían', 'aran', 'ieran', 'asen', 'iesen', 'aron', 'ieron', 'ado', 'ido', 'ando', 'iendo', 'ió', 'ar', 'er', 'ir', 'as', 'abas', 'adas', 'idas', 'ías', 'aras', 'ieras', 'ases', 'ieses', 'ís', 'áis', 'abais', 'íais', 'arais', 'ierais', '  aseis', 'ieseis', 'asteis', 'isteis', 'ados', 'idos', 'amos', 'ábamos', 'íamos', 'imos', 'áramos', 'iéramos', 'iésemos', 'ásemos'])) != ''){
                        word = word.substr(0,-suf.length);
                    }
                }
                
                //Always do step 3.
                r1_txt = word.substr(r1);
                r2_txt = word.substr(r2);
                rv_txt = word.substr(rv);
                
                if((suf = this.endsinArr(rv_txt,['os', 'a', 'o', 'á', 'í', 'ó'])) != ''){
                    word = word.substr(0,-suf.len);
                }else if((suf = this.endsinArr(rv_txt,['e','é'])) != ''){
                    word = word.substr(0,-1);
                    rv_txt = word.substr(0,rv);
                    if(this.endsin(rv_txt,'u') && this.endsin(word,'gu')){
                        word = word.substr(0,-1);
                    }
                }
                
                return this.removeAccent(word); 
            }
        }
    }
}
String.prototype.replaceArray = function(find,replace){
    var replaceString = this;
    for (var i = 0; i < find.length; i++) {
        replaceString = replaceString.replace(find[i], replace[i]);
    }
    return replaceString;
}