import '../css/app.sass';
import $ from 'jquery';

export class Parser {
  constructor(TEXTAREA) {

    let resultHTML = null;
    let $root = $("#root");

    TEXTAREA.addEventListener("keyup", (event) => {
      try {
        resultHTML = this.itemParse(JSON.parse(this.trim(event.target.value)));
        $root.html((resultHTML) ? resultHTML : "Invalid JSON");
      } catch (exception) {
        $root.html(exception);
      }
    }); 

    try {
      resultHTML = this.itemParse(JSON.parse(this.trim(TEXTAREA.value)));
      $root.html((resultHTML) ? resultHTML : "Invalid JSON");
    } catch (exception) {
      $root.html(exception);
    }

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

  objectParse(textObject, analisysArr) {
    console.log ('aa');

    let objectKeys = Object.keys(textObject);
    objectKeys.forEach((item, idx) => {
      let value = textObject[item];
      if (value === null) value = "null";
      if (typeof value === "object") {
        value = this.surroundTag(this.itemParse(value), "toggle-wrap");
      } else {
        value = this.surroundTag(value);
      }
      let comma = (idx < objectKeys.length - 1) ? "," : "";
      analisysArr.push("<li>");
      analisysArr.push(this.surroundTag(item, "property"));
      analisysArr.push(":");
      analisysArr.push(value + comma);
      analisysArr.push("</li>");
    });
    return objectKeys.length;
  }

  arrayParse(textArray, analisysArr) {

    textArray.forEach((item, idx) => {
      if (typeof item === "object") {
        item = this.surroundTag(this.itemParse(item), "toggle-wrap");
      } else {
        item = this.surroundTag(item);
      }
      let comma = (idx < textArray.length - 1) ? "," : "";
      analisysArr.push("<li>");
      analisysArr.push(item + comma);
      analisysArr.push("</li>");
    });
    return textArray.length;
  }

  itemParse(original) {

    let analisysArr = [];
    if (original.constructor === Object) {
      analisysArr.push(this.surroundTag("{", "toggle"));
      analisysArr.push("<ul>");
      let objectLength = this.objectParse(original, analisysArr);
      analisysArr.push("</ul>");
      analisysArr.push(this.surroundTag("}", "toggle-end", objectLength));
    }
    else if (original.constructor === Array) {
      analisysArr.push(this.surroundTag("[", "toggle"));
      analisysArr.push("<ol>");
      let arrayLength = this.arrayParse(original, analisysArr);
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
      type = (typeof item === "string") ? "string" : "number";
    }
    if (type === "string" || type === "property") {
      item =  `"${item}"`;
    }
    return `<span class="${type}" ${count}>${item}</span>`;
  }

  trim(text) {
    if (!text) return;
    text = text.replace(/(\n|\r)/g,"");
    return text.replace(/(^\s*|\s*$)/g,"");
  }
}
