const sendData = (event, post_url, redirect_url) => {
  event.preventDefault()
  const form = event.target
  const formData = new FormData(form)
  const data = {}
  formData.forEach((value, key) => {
    data[key] = value
  })
  axios.post(post_url, data)
    .then(res => {
      window.location = redirect_url
    })
}


const statusData = (event, model, id) => {
  event.preventDefault()
  if (event.target == event.currentTarget) {
    let a = event.currentTarget
    let status = a.getAttribute('data-status') == 'true' ? false : true
    axios.get(`/api/crud/${model}/${status}/${id}`)
      .then(res => {
        a.setAttribute('data-status', res.data.status)
        a.classList.toggle('badge-warning')
        a.classList.toggle('badge-success')
        a.textContent = res.data.status == 'true' ? 'Faol' : 'Nofaol'
      })
  }
} 