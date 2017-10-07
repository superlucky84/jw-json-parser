
import '../css/app.sass'

export class Parser {
  constructor(TEXTAREA) {

    let middleObject = null;

    TEXTAREA.addEventListener("keyup", (event) => {
      middleObject = this.itemParse(event.target.value);
    });
    middleObject = this.itemParse(TEXTAREA.value);
    console.log(middleObject);
  }

  print(middleObject) {
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
    splitArr.forEach((item) => {
      let keyValue = this.separateKayValue(item);
      if (keyValue.length > 0) {
        let startMatchFlag = this.searchMatchFlag(keyValue[1], "start");
        if (startMatchFlag) {
          keyValue[1] = this.itemParse(keyValue[1]);
        }
        analisysArr.push({
          "key": this.trim(keyValue[0]),
          "value": keyValue[1]
        });
      }
    });
  }
  arrayParse(text, analisysArr) {
    let splitArr = this.objectItemSplit(text);
    splitArr.forEach((item) => {
      let startMatchFlag = this.searchMatchFlag(item, "start");
      if (startMatchFlag) {
        item = this.itemParse(item);
      }
      analisysArr.push(item);
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
      analisysArr.push("{");
      this.objectParse(text, analisysArr);
      analisysArr.push("}");
    }
    else if (startMatchFlag === "[") {
      analisysArr.push("[");
      this.arrayParse(text, analisysArr);
      analisysArr.push("]");
    }
    return analisysArr;
  }
}





















