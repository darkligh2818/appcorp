const fs = require('fs')

const uploadFile = async (file, model) => {
  const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
  const destinationDirectory = `${__dirname}/../files/${model}`
  await fs.mkdir(destinationDirectory, { recursive: true }, async (err) => {
    if (err) {
      console.error('Error creating directory:', err)
      return 'Internal server error'
    } else {
      const filepath = `files/${model}/${uniquePreffix}_${file.name}`
      await file.mv(`${__dirname}/../${filepath}`)
      return filepath
    }
  })
}


module.exports = {
  uploadFile
}