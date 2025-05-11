let fetchConf = null
// console.log(window.location.hostname);
switch (window.location.hostname) {
    case ("localhost"):
        fetchConf = "http://localhost:3000";
        break;
    default:
        // fetchConf = "https://app-server.ngagezone.com";
        fetchConf = "https://ramadan-backend-hvc6cnbbcrb9a6h7.israelcentral-01.azurewebsites.net/";
        break;

}
export default fetchConf;
