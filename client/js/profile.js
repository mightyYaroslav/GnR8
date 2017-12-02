window.onload = function() {
    if(JSON.parse(window.localStorage.getItem('user')).role !== 'admin') {
        window.location.replace('error.html')
    } else {
        var xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    var source = document.getElementById('profiles-template').innerHTML
                    var template = Handlebars.compile(source)
                    var context = { users: this.response.users }
                    document.getElementById('profilesList').innerHTML = template(context)
                } else {
                    window.location.replace('error.html')
                }
            }
        }
        xhr.open('get', 'http://localhost:8080/profiles', true)
        xhr.setRequestHeader('Authorization', 'bearer ' + window.localStorage.getItem('token'))
        xhr.responseType = 'json'
        xhr.send()
    }
}

Handlebars.registerHelper('profilesList', (items, options) => {
    if(items == null || items.length === 0)
        return '<h1>Nothing found</h1>'

    var out = '<ul class="list-group">'
    for(var i=0; i < items.length; i++)
        out += '<li class="list-group-item">' + items[i].username + '</li>'
    return out + '</ul>'
})