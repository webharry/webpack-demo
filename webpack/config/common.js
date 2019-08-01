module.exports = {
    getHost() {
        const BRANCH = `${process.env.BRANCH}`
        let HOST = ""
        switch(BRANCH){
            case "dev":
                HOST = "http://localhost:9000"
                break;
            default:
                HOST = ""
        }
        return HOST
    }
}