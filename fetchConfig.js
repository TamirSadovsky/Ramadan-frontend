let fetchConf = null
// console.log(window.location.hostname);
switch (window.location.hostname) {
    case ("localhost"):
        fetchConf = "http://localhost:3000";
        break;
    default:
        // fetchConf = "https://app-server.ngagezone.com";
        fetchConf = "http://localhost:3000";
        break;

}
export default fetchConf;
