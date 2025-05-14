import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import xml from "highlight.js/lib/languages/xml"; // HTML용
import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
import "highlight.js/styles/atom-one-dark.css";

hljs.registerLanguage("python", python);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("css", css);

export default hljs;
