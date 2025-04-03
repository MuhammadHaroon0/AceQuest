class Response {
    constructor(status, data) {
        this.status = status
        this.length = data ? data.length : 0
        this.data = data
    }
}
module.exports = Response