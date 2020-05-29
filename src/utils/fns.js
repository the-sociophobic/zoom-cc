//test ZOOM CC

axios.defaults.headers.post['Host'] = "wmcapi.zoom.us:81"
axios.defaults.headers.post['Accept'] = "*/*"
axios.defaults.headers.post['Content-Type'] = "text/plain"

var countCC = 360

const ZOOMtoken = countCC =>
  `https://us04wmcc.zoom.us/closedcaption?id=6780095847&ns=TGV2IFZhc2lseWV2J3MgUGVyc29uYWwgTWVldGlu&expire=86400&sparams=id%2Cns%2Cexpire&signature=VhsJWd9JBFBx-ZOLPaTQ1Vw9kdLsDSIiVxxqgirt3aQ.EwEAAAFyIE0D8gABUYAYNFl4VkxXT0lLNjBDWEN2a1pyRzFDZz09QGZZTVA1RS9uS3ZlY202WmlzMVVaYkJUWnFBL2VvOGxBWDZnbnFSUmtOd3pWODVkNy9rcHZQN0FpNlo2UlBPSXo&seq=${countCC}&lang=ru`

const postCC = string => 
  axios
    .post(
      ZOOMtoken(countCC++),
      string + "\n"
    ).then(a => console.log(a.data))

const playCCArray = arrayCC => {
  const playNext = currentIndex => {
    postCC(arrayCC[currentIndex])
    if (currentIndex < arrayCC.length - 1)
      setTimeout(() => playNext(currentIndex + 1), 1500)
  }

  playNext(0)
}

const arrayCC = [
  "Я в рот ебал твою мать, ",
  "Я в рот ебал твою мать, ",
  "Я в рот ебал твою мать, ",
  "Пойду насру ей на грудь.",
  "Я не хочу её ебать,",
  "Лучше мочи пойти хлебнуть.",
  "Говно вкусней её стряпни.",
  "А пук лучше звучит,",
  "Чем голос этой хуерги.",
  "Пойди и ёбни ей с ноги.",
]

playCCArray(arrayCC)
