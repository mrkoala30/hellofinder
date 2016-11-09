class utils {
    constructor(torrent,link){
    }
    get torrent(){
        return this.torrent;
    }

     static replaceAll( text, busca, reemplaza ){
        while (text.toString().indexOf(busca) != -1)
            text = text.toString().replace(busca,reemplaza);
        return text;
    }
}

module.exports = utils;
