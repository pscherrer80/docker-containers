  const intvl=setInterval(async () => {
    $('#running').show()
    $('#finished').hide()
    const addr=$('#churl').attr("data-checkurl")
    const resp = await fetch(addr)
    const json = await resp.json()
    if (json.status == "running") {
      $('#process').html(`<b> ${json.process}%</b>`)
    } else {
      $('#running').hide()
      $('#finished').show()
      clearInterval(intvl)
    }
  }, 1000)

