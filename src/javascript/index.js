
import '../css/app.sass'

export class Parser {
  constructor(TEXTAREA) {

    let resultHTML = null;
    let root = document.getElementById("root");

    TEXTAREA.addEventListener("keyup", (event) => {
      resultHTML = this.itemParse(event.target.value);
      root.innerHTML = resultHTML;
    }); resultHTML = this.itemParse(TEXTAREA.value);
    root.innerHTML = resultHTML;
  }

  trim(text) {
    text = text.replace(/(\n|\r)/g,"");
    return text.replace(/(^\s*|\s*$)/g,"");
  }

  searchMatchFlag(text, serarchPoint) {
    if (!text) {
      return;
    }

    let matchFlag = null;
    if (serarchPoint === "start") {
      matchFlag = text.match(/^(\{|\[)/);
    }
    else if (serarchPoint === "end") {
      matchFlag = text.match(/(\}|\])$/);
    }
    if (matchFlag === null) {
      return null;
    }
    return matchFlag[0];
  }

  compareMatchFlag(startFlag, endFlag) {
    if (startFlag === "{" && endFlag !== "}") {
      return true;
    }
    if (startFlag === "[" && endFlag !== "]") {
      return true;
    }
    return false;
  }

  removeMatchFlagString(text) {
    text = text.replace(/^(\{|\[)/,"");
    text = text.replace(/(\}|\])$/,"");
    return text;
  }

  // 키와 벨류를 분리함
  separateKayValue(item) {

    let key = item.replace(/(.*?):(.*)/,"$1");
    let value = item.replace(/(.*?):(.*)/,"$2");

    let keyValueArr = item.match(/(.*?):(.*)/);
    if (keyValueArr) {
      return [keyValueArr[1], keyValueArr[2]];
    }
    return [];
  }

  objectItemSplit(text) {
    let splitArr = text.split(",");
    let newsplitArr = [];
    let serarchPoint = [];
    let match = null;
    let closeMatch = null;
    splitArr.forEach((item) => {
      let matchStart = false;
      if(match === null) { 
        match = item.match(/(\{|\[)/);
        if (match) {
          match = match[0];
          closeMatch = (match == "{") ? "}" : "]";
          matchStart = true;
        }
      }
      let matchArr = item.match(new RegExp("\\" + match, "g"));
      let closeMatchArr = item.match(new RegExp("\\" + closeMatch, "g"));
      // 플래그 매칭
      if (matchArr) {
        serarchPoint = serarchPoint.concat(matchArr);
      }
      if (matchStart === true || serarchPoint.length === 0) {
        newsplitArr.push(item);
      } else if (serarchPoint.length > 0) {
        let newSplitLastIdx = newsplitArr.length - 1;
        newsplitArr[newSplitLastIdx] =  `${newsplitArr[newSplitLastIdx]},${item}`;
      }
      if (serarchPoint.length > 0 && closeMatchArr) {
        serarchPoint.splice(0, closeMatchArr.length);
        if (serarchPoint.length === 0) { match = null; }
      }
    });
    return newsplitArr;
  }

  objectParse(text, analisysArr) {
    let splitArr = this.objectItemSplit(text);
    splitArr.forEach((item, idx) => {
      
      let keyValue = this.separateKayValue(item);
      if (keyValue.length > 0) {
        let startMatchFlag = this.searchMatchFlag(this.trim(keyValue[1]), "start");
        if (startMatchFlag) {
          keyValue[1] = this.itemParse(keyValue[1]);
        }
        let comma = (idx < splitArr.length - 1) ? "," : "";
        analisysArr.push("<li>");
        analisysArr.push(this.surroundTag(this.trim(keyValue[0]), "property"));
        analisysArr.push(":");
        analisysArr.push(this.surroundTag(keyValue[1]) + comma);
        analisysArr.push("</li>");
      }
    });
  }
  arrayParse(text, analisysArr) {
    let splitArr = this.objectItemSplit(text);
    splitArr.forEach((item, idx) => {
      let startMatchFlag = this.searchMatchFlag(this.trim(item), "start");
      if (startMatchFlag) {
        item = this.itemParse(item);
      }
      let comma = (idx < splitArr.length - 1) ? "," : "";
      analisysArr.push("<li>");
      analisysArr.push(this.surroundTag(item) + comma);
      analisysArr.push("</li>");
    });
  }

  itemParse(original) {
    let analisysArr = [];
    let text = this.trim(original);
    let startMatchFlag = this.searchMatchFlag(text, "start");
    let endMatchFlag = this.searchMatchFlag(text, "end");
    if (this.compareMatchFlag(startMatchFlag, endMatchFlag)) {
      return;
    }
    text = this.removeMatchFlagString(text);
    if (startMatchFlag === "{") {
      analisysArr.push(this.surroundTag("{", "toggle"));
      analisysArr.push("<ul>");
      this.objectParse(text, analisysArr);
      analisysArr.push("</ul>");
      analisysArr.push(this.surroundTag("}", "toggle-end"));
    }
    else if (startMatchFlag === "[") {
      analisysArr.push(this.surroundTag("[", "toggle"));
      analisysArr.push("<ol>");
      this.arrayParse(text, analisysArr);
      analisysArr.push("</ol>");
      analisysArr.push(this.surroundTag("]", "toggle-end"));
    }
    return analisysArr.join("");
  }

  surroundTag(item, type) {
    if (typeof item === "object") {
      return item;
    }
    if (!type) {
      type = (item.match(/^"/)) ? "string" : "number";
    }
    return `<span class="${type}">${item}</span>`;
  }
}





















