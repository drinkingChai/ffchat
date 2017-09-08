$(function() {

  if (localStorage.getItem('key')) {
    $.get(`/users/validate/${localStorage.getItem('key')}`)
    .then(user=> {
      if (!user) localStorage.removeItem('key')
      else window.location.replace(`index`)
    })
  }

  $('#new').on('click', ()=> {
    const name = $('#username').val(),
      password = $('#password').val()

    $.ajax({
      url: '/users/new',
      type: 'POST',
      data: JSON.stringify({ name, password }),
      contentType: 'application/json'
    })
    .then(key=> {
      if (key) {
        localStorage.setItem('key', key)
        window.location.replace('/index') // replace this by changing panel
      }
    })
  })

  $('#sign-in').on('click', ()=> {
    const name = $('#username').val(),
      password = $('#password').val()

    $.get(`/users/login/${name}/${password}`)
    .then(user=> {
      if(user) {
        localStorage.setItem('key', user.hash)
        window.location.replace('/index') // replace these
      }
    })
  })
})