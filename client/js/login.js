function login(form) {
    if(event.preventDefault)
        event.preventDefault()
    else
        event.returnValue = false

    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if(this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                window.localStorage.setItem('token', this.response.token)
                window.localStorage.setItem('user', JSON.stringify(this.response.user))
                window.location.replace('albums.html')
            } else {
                window.localStorage.removeItem('token')
                window.localStorage.removeItem('user')
                var source = document.getElementById('error-template').innerHTML
                var template = Handlebars.compile(source)
                var context = { error: this.response.error }
                document.getElementById('error').innerHTML = template(context)
            }
        }
    }
    xhr.open(form.method, form.action, true)
    xhr.responseType = 'json'
    xhr.send(new FormData(form))
}