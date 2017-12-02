function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

window.onload = function() {
    if (!window.localStorage.getItem('token')) {
        window.location.replace('error.html')
    } else {
        var id = getParameterByName('id')
        var xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    console.log(this.response)
                    var album = this.response
                    album.image = btoa(new Uint8Array(album.image.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
                    var source = document.getElementById('album-template').innerHTML
                    var template = Handlebars.compile(source)
                    document.getElementsByClassName('album')[0].innerHTML = template(album)
                    source = document.getElementById('header-template').innerHTML
                    template = Handlebars.compile(source)
                    document.getElementsByTagName('title')[0].innerHTML = template(album)
                } else {
                    window.location.replace('error.html')
                }
            }
        }
        xhr.open('get', 'http://localhost:8080/albums/all/' + id, true)
        xhr.setRequestHeader('Authorization', 'bearer ' + window.localStorage.getItem('token'))
        xhr.responseType = 'json'
        xhr.send()
    }
}
