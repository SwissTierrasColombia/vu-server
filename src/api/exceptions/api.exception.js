
/**
 * Function new exception
 **/
export default function APIException(key, codeHttp, message) {
    this.key = key;
    this.codeHttp = codeHttp;
    this.errorMessage = message;
}
