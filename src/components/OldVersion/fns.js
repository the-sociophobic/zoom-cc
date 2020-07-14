import axios from 'axios'
import serverURL from 'utils/serverURL'


axios.defaults.headers.post['Accept'] = "*/*"
axios.defaults.headers.post['Content-Type'] = "json"

const requestLink = props =>
  props.APIToken + `&seq=${props.count}&lang=ru`

const postCC = props => 
  axios
    .post(
      serverURL + "old",
      {
        URL: requestLink(props),
        string: props.string + "\n"
      }
    ).then(a => console.log(a.data))


export {
  postCC
}