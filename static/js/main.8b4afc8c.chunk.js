(this["webpackJsonpzoom-cc"]=this["webpackJsonpzoom-cc"]||[]).push([[0],{16:function(e,t,n){e.exports=n(39)},38:function(e,t,n){},39:function(e,t,n){"use strict";n.r(t);var r=n(0),o=n.n(r),a=n(15),c=n.n(a),s=n(2),u=n(3),l=n(4),i=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var r;return Object(s.a)(this,n),(r=t.call(this,e)).focus=function(){return r.inputFieldRef.current&&r.inputFieldRef.current.focus()},r.blur=function(){return r.inputFieldRef.current&&r.inputFieldRef.current.blur()},r.onKeyDown=function(e){var t=""+r.props.value;r.props.number&&r.props.value&&t.match(/[^0-9]/g)&&r.props.onChange(t.replace(/[^0-9]/g,"")),r.props.onKeyDown&&r.props.onKeyDown(e)},r.onFocus=function(e){r.props.onFocus&&r.props.onFocus(e)},r.onBlur=function(e){r.props.onBlur&&r.props.onBlur(e)},r.render=function(){return o.a.createElement("div",{className:"form-group "+r.props.className+" "+(r.props.errorMessage&&"form-group--error")},o.a.createElement("input",{ref:r.inputFieldRef,type:r.props.number?"number":"text",className:"form-group__input",placeholder:r.props.placeholder,required:r.props.required,value:r.props.value,onChange:function(e){return r.props.onChange(e.target.value)},onFocus:r.onFocus,onBlur:r.onBlur,onKeyDown:r.onKeyDown,disabled:r.props.disabled}),r.props.label&&o.a.createElement("label",{className:"form-group__label"},r.props.label))},r.inputFieldRef=e.inputFieldRef||o.a.createRef(),r}return n}(r.Component),p=(r.Component,n(5)),m=n.n(p);m.a.defaults.headers.post.Accept="*/*",m.a.defaults.headers.post["Content-Type"]="json";var d=function(e){return e.APIToken+"&seq=".concat(e.count,"&lang=ru")},f=(n(38),["\u042f \u0432 \u0440\u043e\u0442 \u0435\u0431\u0430\u043b \u0442\u0432\u043e\u044e \u043c\u0430\u0442\u044c, ","\u041f\u043e\u0439\u0434\u0443 \u043d\u0430\u0441\u0440\u0443 \u0435\u0439 \u043d\u0430 \u0433\u0440\u0443\u0434\u044c.","\u042f \u043d\u0435 \u0445\u043e\u0447\u0443 \u0435\u0451 \u0435\u0431\u0430\u0442\u044c,","\u041b\u0443\u0447\u0448\u0435 \u043c\u043e\u0447\u0438 \u043f\u043e\u0439\u0442\u0438 \u0445\u043b\u0435\u0431\u043d\u0443\u0442\u044c.","\u0413\u043e\u0432\u043d\u043e \u0432\u043a\u0443\u0441\u043d\u0435\u0439 \u0435\u0451 \u0441\u0442\u0440\u044f\u043f\u043d\u0438.","\u0410 \u043f\u0443\u043a \u043b\u0443\u0447\u0448\u0435 \u0437\u0432\u0443\u0447\u0438\u0442,","\u0427\u0435\u043c \u0433\u043e\u043b\u043e\u0441 \u044d\u0442\u043e\u0439 \u0445\u0443\u0435\u0440\u0433\u0438.","\u041f\u043e\u0439\u0434\u0438 \u0438 \u0451\u0431\u043d\u0438 \u0435\u0439 \u0441 \u043d\u043e\u0433\u0438."].map((function(e){return{string:e,ref:o.a.createRef()}}))),h=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var r;return Object(s.a)(this,n),(r=t.call(this,e)).next=function(){var e=r.state,t=e.current,n=e.counter,o=(e.lines,e.text),a=e.APIToken;t>=o.split("\n").length||(console.log(o.split("\n")),window.history.replaceState(null,null,"/zoom-cc/#"+n),function(e){m.a.post("https://schedule.tochkadostupa.spb.ru/zoom-cc",{URL:d(e),string:e.string+"\n"}).then((function(e){return console.log(e.data)}))}({string:o.split("\n")[t],count:n,APIToken:a}),r.setState({current:t+1,counter:n+1}))},r.render=function(){return o.a.createElement("div",{className:"App"},o.a.createElement("div",{className:"container"},o.a.createElement(i,{value:r.state.APIToken,onChange:function(e){return r.setState({APIToken:e})},label:"ZOOM API token",placeholder:"\u0421\u043a\u043e\u043f\u0438\u0440\u0443\u0439\u0442\u0435 \u0438 \u0432\u0441\u0442\u0430\u0432\u044c\u0442\u0435 ZOOM API token \u0438\u0437 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f"})),o.a.createElement("div",{className:"container"},"\u0422\u0435\u043a\u0443\u0449\u0438\u0439 \u0441\u0443\u0431\u0442\u0438\u0442\u0440: ",0===r.state.current?"":r.state.current<=r.state.text.split("\n").length&&r.state.text.split("\n")[r.state.current-1]),o.a.createElement("div",{className:"container"},o.a.createElement("textarea",{className:"LinedTextArea",value:r.state.text,onChange:function(e){return r.setState({text:e.target.value})}})),o.a.createElement("div",{className:"container"},o.a.createElement("button",{disabled:0===r.state.APIToken.length||0===r.state.text.length||r.state.current>=r.state.text.split("\n").length,className:"button button--main",onClick:function(){return r.next()}},"NEXT")))},r.state={APIToken:"",current:0,counter:parseInt(window.location.hash.replace(/[^0-9]/g,""))||1,lines:f,text:"\u0412 \u044d\u0442\u043e \u0442\u0435\u043a\u0441\u0442\u043e\u0432\u043e\u0435 \u043f\u043e\u043b\u0435 \u043c\u043e\u0436\u043d\u043e \u0432\u0431\u0438\u0442\u044c \u0441\u0432\u043e\u0438 \u0441\u0443\u0431\u0442\u0438\u0442\u0440\u044b.\n\u041a\u0430\u0436\u0434\u0430\u044f \u043d\u043e\u0432\u0430\u044f \u0441\u0442\u0440\u043e\u043a\u0430 \u0431\u0443\u0434\u0435\u0442 \u043e\u0442\u0434\u0435\u043b\u044c\u043d\u044b\u043c \u0441\u0443\u0431\u0442\u0438\u0442\u0440\u043e\u043c\n\u0427\u0442\u043e\u0431\u044b \u0432 ZOOM \u043e\u0442\u043e\u0431\u0440\u0430\u0437\u0438\u043b\u0430\u0441\u044c \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0430\u044f \u0441\u0442\u0440\u043e\u043a\u0430, \u043d\u0430\u0436\u043c\u0438\u0442\u0435 NEXT\n\u042d\u0442\u0443 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0443 \u043d\u0435 \u0441\u0442\u043e\u0438\u0442 \u043f\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0436\u0430\u0442\u044c, \u0438\u043d\u0430\u0447\u0435 \u0432\u0441\u0451 \u043c\u043e\u0436\u0435\u0442 \u0441\u0431\u0438\u0442\u044c\u0441\u044f \u0438 \u0441\u043b\u043e\u043c\u0430\u0442\u044c\u0441\u044f\n"},r}return n}(r.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(h,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[16,1,2]]]);
//# sourceMappingURL=main.8b4afc8c.chunk.js.map