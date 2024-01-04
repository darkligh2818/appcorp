const Candidat = require('../../../models/interview/candidat')
const User = require('../../../models/user')

const bcrypt = require('bcrypt')
const config = require('config')
const nodemailer = require('nodemailer')

const { sendemail } = require('../../../utils/email')
const { uploadFile } = require('../../../utils/file')

const add_candidat = async (req, res) => {
  // try {
  const { first_name, last_name, second_name, rank, email, password } = req.body
  let candidat
  let resume
  let photo

  if (req.files.resume) {
    resume = await uploadFile(req.files.resume, 'resume')
  }

  if (req.files.photo) {
    photo = await uploadFile(req.files.photo, 'photo')
  }

  if (!email) {
    return res.status(500).json({
      msg: 'Email yozilmagan'
    })
  }

  let checkUser = await User.findOne({ email }).lean()

  if (checkUser?.email) {
    let checkCandidat = await Candidat.findOne({
      user: checkUser._id
    }).lean()

    if (checkCandidat) {
      candidat = await Candidat.findByIdAndUpdate(checkCandidat._id, {
        ...checkCandidat,
        first_name,
        last_name,
        second_name,
        rank,
        resume,
        photo,
      }, { new: true })

      let html = `
        <h2>RED PANDA Kompaniyamizga hush kelibsiz</h2>
        <h3>Sizga qaytadan tizimda dostup ochildi</h3>
        <h4>Yaqin kunlarda suhbatga taklif qilamiz</h4>
        `

      sendemail(email, 'Suhbatdan otish', html)
        .then(() => {
          res.status(201).json({
            msg: "Suhbatgaa taklif jonatildi",
            result: candidat,
          })
        })
        .catch(err => {
          res.status(500)
            .json({
              err
            })
        })

    } else {
      let html = `
        <h2>RED PANDA Kompaniyamizga hush kelibsiz</h2>
        <h3>Sizga tizimda dostup ochildi</h3>
        <h4>Yaqin kunlarda suhbatga taklif qilamiz</h4>
        `
      await new Candidat({
        first_name,
        last_name,
        second_name,
        rank,
        resume,
        photo,
        user: checkUser._id
      })
        .save()
        .then(result => {
          sendemail(email, 'SUHBATGA TAKLIF', html)
            .then(() => {
              res.status(201).json({
                msg: "Suhbatga taklif jonatildi",
                result
              })
            })
            .catch(err => {
              res.status(500)
                .json({
                  err
                })
            })
        })
    }

  } else {
    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.match(validRegex)) {
      res.status(500).json({
        msg: 'email notogri formatda'
      })
    }

    const hashPass = await bcrypt.hash(password, 10)
    const user = new User({
      email,
      password: hashPass,
      status: 1,
      role: 'candidat'
    })

    let html = `
    <h2>RED PANDA Kompaniyamizga hush kelibsiz</h2>
    <h3>Sizga tizimda dostup ochildi</h3>
    <h4>Yaqin kunlarda suhbatga taklif qilamiz</h4>
    `

    user.save()
      .then(async (result) => {
        await new Candidat({
          first_name,
          last_name,
          second_name,
          rank,
          resume,
          photo,
          user: result._id
        })
          .save()
          .then(result => {
            sendemail(email, 'Suhbatga taklif', html)
              .then(() => {
                res.status(201).json({
                  msg: "Suhbatga taklif jonatildi",
                  result
                })
              })
              .catch(err => {
                res.status(500)
                  .json({
                    err
                  })
              })
          })
      })
      .catch((error) => {
        res.status(500).json({
          error,
        })
      })
  }

  // } catch (err) {
  //   res.status(500).json({
  //     err
  //   })
  // }

}


module.exports = {
  add_candidat
}
