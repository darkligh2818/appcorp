const addZero = val => val > 9 ? val : '0' + val

const convertDate = val => {
  let date = new Date(val)

  return `${addZero(date.getHours())}:${addZero(date.getMinutes())}:${addZero(date.getDate())}/${addZero(date.getMonth() + 1)}/${addZero(date.getFullYear())}`
}


module.exports = {
  addZero,
  convertDate
}