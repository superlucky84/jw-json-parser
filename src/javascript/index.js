
import '../css/app.sass'
import $ from 'jquery'

export class Parser {
  constructor(TEXTAREA) {

    let resultHTML = null;
    let $root = $("#root");

    TEXTAREA.addEventListener("keyup", (event) => {
      resultHTML = this.itemParse(this.encodeSplitCharactor(event.target.value));
      $root.html((resultHTML) ? resultHTML : "Invalid JSON");
    }); 

    resultHTML = this.itemParse(this.encodeSplitCharactor(TEXTAREA.value));
    $root.html((resultHTML) ? resultHTML : "Invalid JSON");

    $root.bind('click', (event) => {
      let target = event.target;
      if ($(target).hasClass("toggle") === false && $(target).hasClass("toggle-end") === false ) {
        return;
      }
      if ($(target).parent("span, div").hasClass("hide")) {
        $(target).parent("span, div").removeClass("hide");
      }
      else {
        $(target).parent("span, div").addClass("hide");
      }
    });
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

    if (!text) return;

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
      if ((matchStart === true || serarchPoint.length === 0) && item) {
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
    return splitArr.length;
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
    return splitArr.length;
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
      let objectLength = this.objectParse(text, analisysArr);
      analisysArr.push("</ul>");
      analisysArr.push(this.surroundTag("}", "toggle-end", objectLength));
    }
    else if (startMatchFlag === "[") {
      analisysArr.push(this.surroundTag("[", "toggle"));
      analisysArr.push("<ol>");
      let arrayLength = this.arrayParse(text, analisysArr);
      analisysArr.push("</ol>");
      analisysArr.push(this.surroundTag("]", "toggle-end", arrayLength));
    }
    return analisysArr.join("");
  }

  surroundTag(item, type, count) {
    if (count !== undefined) {
      count = `count="${count}"`;
    } else {
      count = "";
    }
    if (typeof item === "object") {
      return item;
    }
    if (!type) {
      type = (item.match(/^"|^'/)) ? "string" : "number";
    }

    if (type === "string" || type === "property") {
      item = this.decodeSplitCharactor(item);
    }

    return `<span class="${type}" ${count}>${item}</span>`;
  }

  encodeSplitCharactor(tvalue) {
    let tvalueArr = tvalue.match(/(\")([^"]*?)(\")/g);
    if (!tvalueArr) { 
      return tvalue;
    }
    tvalueArr.forEach((sItem) => {
      tvalue = tvalue.replace(sItem, sItem.replace(/,/g,"ឦ"));
    });
    return tvalue;
  }

  decodeSplitCharactor(tvalue) {
    return tvalue.replace(/ឦ/g,",");
  }

  trim(text) {
    if (!text) return;
    text = text.replace(/(\n|\r)/g,"");
    return text.replace(/(^\s*|\s*$)/g,"");
  }
}





















