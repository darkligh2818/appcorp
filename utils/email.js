const config = require('config')
const nodemailer = require('nodemailer')

const sendemail = async (to, subject, html) => {
  let configs = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: config.get('email'),
      pass: config.get('key')
    }
  }

  let message = {
    from: `"RED PANDA" <${config.get('email')}>`,
    to,
    subject,
    html,
  } 

  let transporter = nodemailer.createTransport(configs)
  return await transporter.sendMail(message)

}

module.exports = {
  sendemail
}