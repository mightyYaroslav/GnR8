window.onload = getAlbums

function logout() {
    window.localStorage.removeItem('user')
    window.localStorage.removeItem('token')
    window.location.replace('index.html')
}

function getAlbums() {

    if (!window.localStorage.getItem('token')) {
        window.location.replace('error.html')
    } else {
        var xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    console.log(this.response)
                    var source = document.getElementById('albums-template').innerHTML
                    var template = Handlebars.compile(source)
                    var context = {
                        albums: this.response.albums,
                        user: JSON.parse(window.localStorage.getItem('user')),
                        searchText: this.response.searchText
                    }
                    document.getElementById('albums').innerHTML = template(context)
                    document.getElementById('logoutButton').onclick = logout
                } else {
                    window.location.replace('error.html')
                }
            }
        }
        xhr.open('post', 'http://localhost:8080/albums/all', true)
        xhr.setRequestHeader('Authorization', 'bearer ' + window.localStorage.getItem('token'))
        xhr.responseType = 'json'
        xhr.send()
    }

}

function deleteAlbum(form) {
    if(event.preventDefault)
        event.preventDefault()
    else
        event.returnValue = false
    if (!window.localStorage.getItem('token')) {
        window.location.replace('error.html')
    } else {
        var xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    getAlbums()
                } else {
                    window.location.replace('error.html')
                }
            }
        }
        xhr.open(form.method, form.action, true)
        xhr.responseType = 'json'
        xhr.setRequestHeader('Authorization', 'bearer ' + window.localStorage.getItem('token'))
        xhr.send(new FormData(form))
    }
}

function searchAlbums(form) {
    if(event.preventDefault)
        event.preventDefault()
    else
        event.returnValue = false

    if (!window.localStorage.getItem('token')) {
        window.location.replace('error.html')
    } else {
        var xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    console.log(this.response)
                    albums = this.response.albums
                    var source = document.getElementById('albums-template').innerHTML
                    var template = Handlebars.compile(source)
                    var context = {
                        albums: this.response.albums,
                        user: JSON.parse(window.localStorage.getItem('user')),
                        searchText: this.response.searchText
                    }
                    document.getElementById('albums').innerHTML = template(context)
                    document.getElementById('logoutButton').onclick = logout
                } else {
                    window.location.replace('error.html')
                }
            }
        }
        xhr.open(form.method, form.action, true)
        xhr.setRequestHeader('Authorization', 'bearer ' + window.localStorage.getItem('token'))
        xhr.responseType = 'json'
        xhr.send(new FormData(form))
    }
}

Handlebars.registerHelper('ifEqual', (a, b, options) => {
    if(a === b)
        return options.fn(this)
    else
        return options.inverse(this)
})

Handlebars.registerHelper('albumsList', (items, options) => {
    var user = JSON.parse(window.localStorage.getItem('user'))
    if(items == null || items.length === 0)
        return '<h1>Nothing found</h1>'

    var out = ''
    for(var i=0; i < items.length; i++) {
        var encodedImage = btoa(new Uint8Array(items[i].image.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        out +='<div class="gallery">' +
            '<a href="album.html?id='+items[i].id+'">' +
            '<img src="data:image;base64,'+encodedImage+'" alt="image" />' +
            '</a>'
        if(user.role === 'admin') {
            out += '<form action="http://localhost:8080/albums/delete" method="post" onsubmit="deleteAlbum(this)">' +
                '<input type="hidden" name="id" value="' + items[i].id + '">' +
                '<button type="button" value="delete" data-toggle="modal" data-target="#modal"'+items[i].id+'>&times</button>' +
                '<div class="modal" id="modal"'+items[i].id+' tabindex="-1" role="dialog">' +
                '  <div class="modal-dialog" role="document">' +
                '    <div class="modal-content">' +
                '      <div class="modal-header">' +
                '        <h5 class="modal-title" id="exampleModalLabel">Warning</h5>' +
                '        <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                '          <span aria-hidden="true">&times;</span>' +
                '        </button>' +
                '      </div>' +
                '      <div class="modal-body">' +
                '        Are you sure?' +
                '      </div>' +
                '      <div class="modal-footer">' +
                '        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>' +
                '        <button type="submit" class="btn btn-danger">Delete</button>' +
                '      </div>' +
                '    </div>' +
                '  </div>' +
                '</div>' +
                '</form>'
        }
        out += '</div>'
    }

    return out
})

