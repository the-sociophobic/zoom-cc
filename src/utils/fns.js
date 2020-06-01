//test ZOOM CC
import axios from 'axios'


// axios.defaults.headers.post['Host'] = "wmcapi.zoom.us:81"
axios.defaults.headers.post['Accept'] = "*/*"
// axios.defaults.headers.post['Content-Type'] = "text/plain"
axios.defaults.headers.post['Content-Type'] = "json"

var countCC = 360

const requestLink = props =>
  props.APIToken + `&seq=${props.count}&lang=ru`

const postCC = props => 
  axios
    .post(
      "https://schedule.tochkadostupa.spb.ru/zoom-cc",
      // "http://localhost:3000/zoom-cc",
      {
        URL: requestLink(props),
        string: props.string + "\n"
      }
    ).then(a => console.log(a.data))


export {
  postCC
}