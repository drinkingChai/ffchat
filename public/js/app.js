$(function() {
  if (localStorage.getItem('key')) {
    $.get(`/users/validate/${localStorage.getItem('key')}`)
    .then(user=> {
      if (!user) {
        localStorage.removeItem('key')
        return window.location.replace(`/`)
      }

      $('#new-message').focus()
      let socket = io(window.location.origin)

      function sendMessage() {
        if (!$('#new-message').val().trim().length) return

        let payload = { user, message: $('#new-message').val() }
        $.ajax({
          url: '/messages/new',
          type: 'POST',
          data: JSON.stringify(payload),
          contentType: 'application/json'
        })
        .then(newMessage=> {
          socket.emit('newMessage', payload)
          $('#new-message').val("")
        })
      }

      socket.on('newMessage', (payload)=> {
        $('#messages').append(`<li>${payload.user.name}: ${payload.message}</li>`)
      })




      $('#logout').on('click', function() {
        localStorage.removeItem('key')
        window.location.replace(`/`)
      })

      $('button').on('click', function() {
        sendMessage()
      })
      $('#new-message').on('keypress', function(e) {
        if (e.keyCode == '13') sendMessage()
      })
    })
  }
  else window.location.replace(`/`)
})
