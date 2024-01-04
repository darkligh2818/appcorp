const Client = require('../../../models/project/client')

const { convertDate } = require('../../../utils/func')



const all_clients = async (req, res) => {
  let clients = await Client.find().sort({ _id: -1 }).lean()

  res.render('page/project/all_client', {
    clients: clients.map(client => {
      return {
        ...client,
        createdAt: convertDate(client.createdAt),
        statusClass: client.status ? 'badge-success' : 'badge-warning',
        statusText: client.status ? 'faol' : 'Nofaol'
      }
    })
  })
}

const new_client = async (req, res) => {
  res.render('page/project/new_client')
}

const status_client = async (req, res) => {
  if (req.params.id) {
    let { id } = req.params
    let client = await Client.findById(id).lean()
    client.status = !client.status

    await Client.findByIdAndUpdate(id, client, { new: true })
  }


  res.redirect('/project/client')
}


module.exports = {
  new_client,
  all_clients,
  status_client,
}