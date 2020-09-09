const randomNumber = () => {
    const possible = 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let randomNumber = ''
    for (let i = 0; i < 28; i++) {
        randomNumber += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return randomNumber
}

module.exports = randomNumber