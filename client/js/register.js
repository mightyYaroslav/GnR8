function register(form) {
    if(event.preventDefault)
        event.preventDefault()
    else
        event.returnValue = false

    var source = document.getElementById('error-template').innerHTML
    var template = Handlebars.compile(source)

    var password = document.getElementsByName('password')[0].value
    var password2 = document.getElementsByName('password2')[0].value

    if(password != password2) {
        var context = { error: 'Passwords should match' }
        document.getElementById('error').innerHTML = template(context)
    } else {
        var xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    window.location.replace('login.html')
                } else {
                    var context = {error: JSON.stringify(this.response.error)}
                    document.getElementById('error').innerHTML = template(context)
                }
            }
        }
        xhr.open(form.method, form.action, true)
        xhr.responseType = 'json'
        xhr.send(new FormData(form))
    }
}